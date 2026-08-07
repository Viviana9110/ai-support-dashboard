import { NextResponse } from 'next/server';

import { buildCustomerContext } from '@/lib/ai/customer-context';
import { buildKnowledgeContext } from '@/lib/ai/knowledge-context';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';
import { buildTicketContext } from '@/lib/ai/ticket-context';
import { prisma } from '@/lib/db';
import { openai } from '@/lib/openai';
import { serializeAiMessage } from '@/lib/serializers';
import { aiChatSchema } from '@/lib/schemas/ai.schema';

import type { AiMessageRole as DBAiMessageRole } from '@/generated/prisma/enums';

type OpenAIRole = 'user' | 'assistant' | 'system';

const OPENAI_ROLE: Record<DBAiMessageRole, OpenAIRole> = {
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

  const { conversationId, message } = parsed.data;

  let input: Array<{ role: OpenAIRole; content: string }>;

  try {
    const [conversation, articles] = await Promise.all([
      prisma.aiConversation.findUnique({
        where: { id: conversationId, deletedAt: null },
        select: {
          user: {
            select: {
              name: true,
              email: true,
              role: true,
              ticketsAssigned: {
                where: {
                  status: { in: ['OPEN', 'PENDING'] },
                  deletedAt: null,
                },
                orderBy: { updatedAt: 'desc' },
                take: 5,
                select: {
                  subject: true,
                  status: true,
                  priority: true,
                  updatedAt: true,
                },
              },
            },
          },
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

    const tickets = conversation.user?.ticketsAssigned ?? [];

    input = [
      { role: 'system', content: buildSystemPrompt() },
      ...(conversation.user
        ? [{ role: 'system' as const, content: buildCustomerContext(conversation.user) }]
        : []),
      ...(articles.length > 0
        ? [{ role: 'system' as const, content: buildKnowledgeContext(articles) }]
        : []),
      ...(tickets.length > 0
        ? [{ role: 'system' as const, content: buildTicketContext(tickets) }]
        : []),
      ...conversation.messages
        .reverse()
        .map((m) => ({
          role: OPENAI_ROLE[m.role],
          content: m.content,
        })),
      { role: 'user', content: message },
    ];
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
      model: process.env.OPENAI_MODEL ?? 'gpt-5',
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
          where: { id: conversationId, deletedAt: null },
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
          where: { id: conversationId },
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
