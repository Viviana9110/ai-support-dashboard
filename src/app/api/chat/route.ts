import { NextResponse } from 'next/server';

import { buildAiChatInput, type AiChatRole } from '@/lib/ai/chat-context';
import {
  buildOpenAiModelParameters,
  resolveAiConfiguration,
} from '@/lib/ai/model-config';
import { aiRateLimitResponse, checkAiRateLimit } from '@/lib/ai/rate-limit';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/require-session';
import { openai } from '@/lib/openai';
import { serializeAiMessage } from '@/lib/serializers';
import { aiChatSchema } from '@/lib/schemas/ai.schema';

import type { AiMessageRole as DBAiMessageRole } from '@/generated/prisma/enums';

const OPENAI_ROLE: Record<DBAiMessageRole, AiChatRole> = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
};

class ConversationNotFoundError extends Error {
  constructor() {
    super('Conversation not found.');
  }
}

export async function POST(request: Request) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const rateLimitResult = checkAiRateLimit(auth.sub, 'chat');

  if (!rateLimitResult.allowed) {
    return aiRateLimitResponse(rateLimitResult.retryAfterSeconds);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = aiChatSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid chat payload.' },
      { status: 400 },
    );
  }

  const {
    conversationId,
    message,
    assistant,
    model,
    temperature,
  } = parsed.data;

  const configuration = resolveAiConfiguration({
    assistant,
    model,
    temperature,
  });

  if (configuration.status === 'unsupported') {
    return NextResponse.json(
      { error: `Model "${model}" is not supported.` },
      { status: 400 },
    );
  }

  if (configuration.status === 'unconfigured') {
    return NextResponse.json(
      { error: 'Model configuration error.' },
      { status: 500 },
    );
  }

  let input: Array<{ role: AiChatRole; content: string }>;

  try {
    const [conversation, articles] = await Promise.all([
      prisma.aiConversation.findUnique({
        where: { id: conversationId, deletedAt: null, userId: auth.sub },
        select: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 20,
            select: { role: true, content: true },
          },
        },
      }),
      prisma.knowledgeArticle.findMany({
        where: { status: 'PUBLISHED', deletedAt: null },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { title: true, category: true, content: true },
      }),
    ]);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found.' },
        { status: 404 },
      );
    }

    input = buildAiChatInput({
      assistant: configuration.assistant,
      message,
      articles,
      history: conversation.messages
        .reverse()
        .map((m) => ({
          role: OPENAI_ROLE[m.role],
          content: m.content,
        })),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to load the conversation.' },
      { status: 500 },
    );
  }

  let assistantText: string;

  try {
    const response = await openai.responses.create({
      ...buildOpenAiModelParameters(configuration),
      input,
    });

    assistantText = response.output_text;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Unable to generate response.' },
      { status: 500 },
    );
  }

  try {
    const { userMessage, assistantMessage } = await prisma.$transaction(
      async (tx) => {
        const conversation = await tx.aiConversation.findUnique({
          where: { id: conversationId, deletedAt: null, userId: auth.sub },
          select: { id: true },
        });

        if (!conversation) {
          throw new ConversationNotFoundError();
        }

        const userMessage = await tx.aiMessage.create({
          data: {
            role: 'USER',
            content: message,
            aiConversationId: conversationId,
          },
        });

        const assistantMessage = await tx.aiMessage.create({
          data: {
            role: 'ASSISTANT',
            content: assistantText,
            aiConversationId: conversationId,
          },
        });

        await tx.aiConversation.update({
          where: { id: conversationId, userId: auth.sub, deletedAt: null },
          data: { updatedAt: new Date() },
        });

        return { userMessage, assistantMessage };
      },
    );

    return NextResponse.json({
      userMessage: serializeAiMessage(userMessage),
      assistantMessage: serializeAiMessage(assistantMessage),
    });
  } catch (error) {
    if (error instanceof ConversationNotFoundError) {
      return NextResponse.json(
        { error: 'Conversation not found.' },
        { status: 404 },
      );
    }

    console.error(error);

    return NextResponse.json(
      { error: 'Failed to save the chat messages.' },
      { status: 500 },
    );
  }
}
