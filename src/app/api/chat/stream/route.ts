import { NextResponse } from 'next/server';

import { buildAiChatInput, type AiChatRole } from '@/lib/ai/chat-context';
import {
  buildOpenAiModelParameters,
  resolveAiConfiguration,
} from '@/lib/ai/model-config';
import { aiRateLimitResponse, checkAiRateLimit } from '@/lib/ai/rate-limit';
import { prisma } from '@/lib/db';
import { openai } from '@/lib/openai';
import { requireSession } from '@/lib/require-session';
import { aiStreamChatSchema } from '@/lib/schemas/ai.schema';
import { serializeAiMessage } from '@/lib/serializers';

import type { AiMessageRole as DBAiMessageRole } from '@/generated/prisma/enums';

const OPENAI_ROLE: Record<DBAiMessageRole, AiChatRole> = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
};

const DEFAULT_OPENAI_STREAM_TIMEOUT_MS = 60000;

function getOpenAIStreamTimeoutMs(): number {
  const raw = process.env.OPENAI_STREAM_TIMEOUT_MS;
  const value =
    raw === undefined || raw === ''
      ? Number.NaN
      : Number(raw);

  return Number.isFinite(value) && value > 0
    ? value
    : DEFAULT_OPENAI_STREAM_TIMEOUT_MS;
}

export async function POST(request: Request) {
  const auth = await requireSession();

  if (auth instanceof NextResponse) {
    return auth;
  }

  const rateLimitResult = checkAiRateLimit(auth.sub, 'stream');

  if (!rateLimitResult.allowed) {
    return aiRateLimitResponse(rateLimitResult.retryAfterSeconds);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const parsed = aiStreamChatSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ??
          'Invalid chat payload.',
      },
      { status: 400 },
    );
  }

  const { conversationId, message, assistant, temperature, model: requestedModel } =
    parsed.data;

  const resolution = resolveAiConfiguration({
    assistant,
    model: requestedModel,
    temperature,
  });

  if (resolution.status === 'unsupported') {
    return NextResponse.json(
      {
        error: `Model "${requestedModel}" is not supported.`,
      },
      { status: 400 },
    );
  }

  if (resolution.status === 'unconfigured') {
    return NextResponse.json(
      { error: 'Model configuration error.' },
      { status: 500 },
    );
  }

  const resolvedAssistant = resolution.assistant;
  const modelParameters = buildOpenAiModelParameters(resolution);

  const conversation =
    await prisma.aiConversation.findUnique({
      where: {
        id: conversationId,
        deletedAt: null,
        userId: auth.sub,
      },
      select: { id: true },
    });

  if (!conversation) {
    return NextResponse.json(
      { error: 'Conversation not found.' },
      { status: 404 },
    );
  }

  const timeoutMs = getOpenAIStreamTimeoutMs();

  const encoder = new TextEncoder();

  const abortController = new AbortController();

  const stream = new ReadableStream({
    async start(controller) {
      let assistantText = '';
      let timedOut = false;
      let doneEmitted = false;
      let errorEmitted = false;
      let streamCompleted = false;

      const send = (
        payload: Record<string, unknown>,
      ) => {
        try {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify(payload)}\n\n`,
            ),
          );
        } catch {
          // The consumer is gone; there is nothing to send.
        }
      };

      const sendError = () => {
        if (doneEmitted || errorEmitted) return;
        errorEmitted = true;
        send({ type: 'error' });
      };

      const onRequestAbort = () => {
        abortController.abort();
      };

      if (request.signal.aborted) {
        abortController.abort();
      } else {
        request.signal.addEventListener(
          'abort',
          onRequestAbort,
          { once: true },
        );
      }

      const timeoutId = setTimeout(() => {
        timedOut = true;
        abortController.abort();
      }, timeoutMs);

      try {
        const [conversation, articles] =
          await Promise.all([
            prisma.aiConversation.findUnique({
              where: {
                id: conversationId,
                deletedAt: null,
                userId: auth.sub,
              },
              select: {
                customer: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    company: true,
                    status: true,
                    tickets: {
                      where: {
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
                  orderBy: {
                    createdAt: 'desc',
                  },
                  take: 20,
                  select: {
                    role: true,
                    content: true,
                  },
                },
              },
            }),
            prisma.knowledgeArticle.findMany({
              where: {
                status: 'PUBLISHED',
                deletedAt: null,
              },
              orderBy: {
                updatedAt: 'desc',
              },
              take: 5,
              select: {
                title: true,
                category: true,
                content: true,
              },
            }),
          ]);

        if (!conversation) {
          throw new Error(
            'Conversation not found.',
          );
        }

        const input = buildAiChatInput({
          assistant: resolvedAssistant,
          message,
          articles,
          customer: conversation.customer ?? undefined,
          tickets: conversation.customer?.tickets.map((ticket) => ({
            ...ticket,
            customer: {
              id: conversation.customer!.id,
              name: conversation.customer!.name,
            },
          })),
          history: conversation.messages
            .reverse()
            .map((m) => ({
              role: OPENAI_ROLE[m.role],
              content: m.content,
            })),
        });

        const response = await openai.responses.create(
          {
            ...modelParameters,
            input,
            stream: true,
          },
          { signal: abortController.signal },
        );

        for await (const event of response) {
          if (abortController.signal.aborted) {
            break;
          }

          if (
            event.type ===
            'response.output_text.delta'
          ) {
            assistantText += event.delta;

            send({
              type: 'delta',
              content: event.delta,
            });
          }

          if (event.type === 'response.completed') {
            streamCompleted = true;
          }
        }

        if (abortController.signal.aborted) {
          if (timedOut) {
            sendError();
          }
          return;
        }

        if (!streamCompleted || assistantText.trim() === '') {
          throw new Error('OpenAI stream completed without a response.');
        }

        const {
          userMessage,
          assistantMessage,
        } = await prisma.$transaction(
          async (tx) => {
            const conversation =
              await tx.aiConversation.findUnique({
                where: {
                  id: conversationId,
                  deletedAt: null,
                  userId: auth.sub,
                },
                select: { id: true },
              });

            if (!conversation) {
              throw new Error(
                'Conversation not found.',
              );
            }

            const userMessage =
              await tx.aiMessage.create({
                data: {
                  role: 'USER',
                  content: message,
                  aiConversationId:
                    conversationId,
                },
              });

            const assistantMessage =
              await tx.aiMessage.create({
                data: {
                  role: 'ASSISTANT',
                  content: assistantText,
                  aiConversationId:
                    conversationId,
                },
              });

            await tx.aiConversation.update({
              where: {
                id: conversationId,
                userId: auth.sub,
                deletedAt: null,
              },
              data: {
                updatedAt: new Date(),
              },
            });

            return {
              userMessage,
              assistantMessage,
            };
          },
        );

        if (abortController.signal.aborted) {
          if (timedOut) {
            sendError();
          }
          return;
        }

        doneEmitted = true;

        send({
          type: 'done',
          userMessage: serializeAiMessage(
            userMessage,
          ),
          assistantMessage:
            serializeAiMessage(
              assistantMessage,
            ),
        });
      } catch {
        if (abortController.signal.aborted) {
          if (timedOut) {
            sendError();
          }
        } else {
          console.error('OpenAI stream failed.', {
            id: auth.sub,
          });
          sendError();
        }
      } finally {
        clearTimeout(timeoutId);
        request.signal.removeEventListener(
          'abort',
          onRequestAbort,
        );

        try {
          controller.close();
        } catch {
          // The stream was already closed or cancelled.
        }
      }
    },
    cancel() {
      abortController.abort();
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
