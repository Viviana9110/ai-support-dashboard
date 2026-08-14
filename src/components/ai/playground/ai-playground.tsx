'use client';

import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { AlertTriangle, MessageSquare, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';

import {
  useAiConversation,
  useAiConversations,
  useClearAiConversation,
  useCreateAiConversation,
  useRenameAiConversation,
} from '@/hooks/use-ai-conversations';

import { useAiStream } from '@/hooks/use-ai-stream';

import { PlaygroundHeader } from './playground-header';
import { PlaygroundSidebar } from './playground-sidebar';
import { ConversationList } from './conversation-list';
import { ChatWindow } from './chat-window';
import { PromptInput } from './prompt-input';

import {
  ChatConversation,
  ChatMessage,
  Conversation,
} from '@/services/ai/ai.types';
import { resolveActiveConversationId } from '@/lib/ai/conversation-state';
import { useCustomers } from '@/hooks/use-customers';

export function AIPlayground() {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useAiConversations();

  const [assistant, setAssistant] =
    useState('Customer Support AI');

  const [model, setModel] =
    useState('GPT-5');

  const [temperature, setTemperature] =
    useState(0.7);
  const [customerId, setCustomerId] = useState<string | null>(null);

  const [activeConversationId, setActiveConversationId] =
    useState('');
  const [activeConversationHydrated, setActiveConversationHydrated] =
    useState(false);

  const [streamingText, setStreamingText] =
    useState('');
  const [streamError, setStreamError] =
    useState<string | null>(null);
  const [failedPrompt, setFailedPrompt] =
    useState<string | null>(null);
  const [mutationError, setMutationError] =
    useState<string | null>(null);
  const [inputResetKey, setInputResetKey] = useState(0);

  const { startStream, cancelStream, isStreaming } =
    useAiStream();

  useEffect(() => {
    cancelStream();
    setStreamingText('');
    setStreamError(null);
    setFailedPrompt(null);
  }, [activeConversationId, cancelStream]);

  const queryClient = useQueryClient();

  const createAiConversation = useCreateAiConversation();
  const clearAiConversation = useClearAiConversation();
  const updateAiConversation = useRenameAiConversation();
  const { data: customers = [] } = useCustomers();

  const {
    data: detail,
    isLoading: isDetailLoading,
    isError: isDetailError,
    refetch: refetchDetail,
  } = useAiConversation(activeConversationId);

  useEffect(() => {
    try {
      setActiveConversationId(
        window.localStorage.getItem('ai-active-conversation') ?? '',
      );
    } catch {
      setActiveConversationId('');
    } finally {
      setActiveConversationHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (isLoading || !activeConversationHydrated) return;

    const nextId = resolveActiveConversationId(data, activeConversationId);

    if (nextId !== activeConversationId) {
      setActiveConversationId(nextId);
    }

    const activeConversation = data.find(
      (conversation) => conversation.id === nextId,
    );
    setCustomerId(activeConversation?.customerId ?? null);

    try {
      if (nextId) {
        window.localStorage.setItem('ai-active-conversation', nextId);
      } else {
        window.localStorage.removeItem('ai-active-conversation');
      }
    } catch {
      // localStorage may be unavailable in private browsing contexts.
    }
  }, [activeConversationHydrated, activeConversationId, data, isLoading]);

  const conversations: ChatConversation[] = data.map(
    (conversation) => ({
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      messages: [],
      messageCount: conversation.messageCount,
      lastMessage: conversation.lastMessage,
      lastMessageRole: conversation.lastMessageRole,
    }),
  );

  const streamedMessage: ChatMessage | null =
    streamingText
      ? {
          id: 'streaming',
          role: 'assistant',
          content: streamingText,
          createdAt: new Date().toISOString(),
        }
      : null;

  const messages = streamedMessage
    ? [...(detail?.messages ?? []), streamedMessage]
    : (detail?.messages ?? []);

  async function handleSend(prompt: string) {
    if (!activeConversationId) return;

    setStreamError(null);

    const completed = await startStream({
      conversationId: activeConversationId,
      message: prompt,
      model,
      temperature,
      assistant,
      onDelta(chunk) {
        setStreamingText(
          (previous) => previous + chunk,
        );
      },
      onDone(payload) {
        const userMessage =
          payload.userMessage as
            | ChatMessage
            | undefined;

        const assistantMessage =
          payload.assistantMessage as
            | ChatMessage
            | undefined;

        setStreamingText('');
        setFailedPrompt(null);

        if (userMessage && assistantMessage) {
          queryClient.setQueryData<Conversation>(
            ['ai-conversations', activeConversationId],
            (previous) => {
              if (!previous) {
                return previous;
              }

              const appended = [
                userMessage,
                assistantMessage,
              ].filter(
                (message) =>
                  !previous.messages.some(
                    (existing) =>
                      existing.id ===
                      message.id,
                  ),
              );

              if (appended.length === 0) {
                return previous;
              }

              return {
                ...previous,
                messages: [
                  ...previous.messages,
                  ...appended,
                ],
              };
            },
          );
        }

        queryClient.invalidateQueries({
          queryKey: [
            'ai-conversations',
            activeConversationId,
          ],
        });
      },
      onError() {
        setStreamingText('');
        setStreamError('Unable to complete the response. Please try again.');
        setFailedPrompt(prompt);
      },
    });

    if (!completed) {
      throw new Error('AI stream failed.');
    }
  }

  async function handleNewConversation() {
    setMutationError(null);

    try {
      const created = await createAiConversation.mutateAsync({
        title: 'New Chat',
        customerId,
      });

      setActiveConversationId(created.id);
    } catch {
      setMutationError('Unable to create the conversation. Please try again.');
    }
  }

  async function handleClear() {
    if (!activeConversationId) return;

    if (isStreaming) return;

    setMutationError(null);

    try {
      await clearAiConversation.mutateAsync(activeConversationId);
    } catch {
      setMutationError('Unable to clear the conversation. Please try again.');
    }
  }

  async function handleCustomerChange(nextCustomerId: string | null) {
    setCustomerId(nextCustomerId);

    if (!activeConversationId) return;

    const activeConversation = data.find(
      (conversation) => conversation.id === activeConversationId,
    );

    if (!activeConversation || activeConversation.customerId === nextCustomerId) {
      return;
    }

    try {
      await updateAiConversation.mutateAsync({
        id: activeConversationId,
        title: activeConversation.title,
        customerId: nextCustomerId,
      });
    } catch {
      setCustomerId(activeConversation.customerId);
      setMutationError('Unable to update the customer context. Please try again.');
    }
  }

  async function handleRetry() {
    if (!failedPrompt) return;

    try {
      await handleSend(failedPrompt);
      setInputResetKey((previous) => previous + 1);
    } catch {
      // Keep the failed prompt available for another retry.
    }
  }

  if (isLoading) {
    return (
      <Card className="flex h-[700px] items-center justify-center">
        Loading AI Playground...
      </Card>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Something went wrong"
        description="We could not load your conversations. Please try again."
        action={
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        }
      />
    );
  }

  if (isDetailLoading) {
    return (
      <Card className="flex h-[700px] items-center justify-center">
        Loading AI Playground...
      </Card>
    );
  }

  if (isDetailError) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Something went wrong"
        description="We could not load this conversation. Please try again."
        action={
          <Button onClick={() => refetchDetail()} variant="outline">
            Retry
          </Button>
        }
      />
    );
  }

  if (data.length === 0) {
    return (
      <Card className="overflow-hidden">
        <PlaygroundHeader model={model} />

        <div className="flex h-[700px] flex-col items-center justify-center gap-4 p-8">
          {mutationError && (
            <p role="alert" className="text-destructive text-sm">
              {mutationError}
            </p>
          )}
          <EmptyState
            icon={MessageSquare}
            title="No conversations yet"
            description="Start a new chat to begin."
            action={
              <Button onClick={handleNewConversation}>
                <Plus size={16} />
                New Chat
              </Button>
            }
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className="min-w-0 overflow-hidden">
      <PlaygroundHeader model={model} />

      {(streamError || mutationError) && (
        <div className="border-b px-6 py-3 text-sm" role="alert">
          <p className="text-destructive">
            {streamError ?? mutationError}
          </p>
          {streamError && failedPrompt && (
            <Button
              className="mt-2"
              size="sm"
              variant="outline"
              onClick={() => void handleRetry()}
            >
              Retry
            </Button>
          )}
        </div>
      )}

      <div className="flex h-[700px] max-h-[calc(100dvh-8rem)] min-h-[520px] min-w-0 flex-col md:flex-row">
        <div className="w-full shrink-0 border-b p-3 md:w-72 md:border-b-0 md:border-r md:p-4">
          <ConversationList
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={setActiveConversationId}
            onNew={handleNewConversation}
          />
        </div>

        <PlaygroundSidebar
          assistant={assistant}
          model={model}
          temperature={temperature}
          customerId={customerId}
          customers={customers}
          onAssistantChange={setAssistant}
          onModelChange={setModel}
          onTemperatureChange={setTemperature}
          onCustomerChange={handleCustomerChange}
          onClear={handleClear}
          clearDisabled={isStreaming}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <ChatWindow
            messages={messages}
            streamingMessageId={streamedMessage?.id}
            loading={isStreaming && streamingText.length === 0}
          />

            <PromptInput
              onSend={handleSend}
              disabled={isStreaming}
              resetKey={inputResetKey}
            />
        </div>
      </div>
    </Card>
  );
}

//TODO: Replace with OpenAI API
// function generateFakeResponse(prompt: string) {
//   const value = prompt.toLowerCase();

//   if (value.includes('password')) {
//     return 'To reset your password, click on "Forgot password" from the login page and follow the instructions.';
//   }

//   if (value.includes('refund')) {
//     return 'Customers can request a refund within 30 days after purchase.';
//   }

//   if (value.includes('hello')) {
//     return 'Hello 👋 How can I assist you today?';
//   }

//   if (value.includes('ticket')) {
//     return 'I can help you create, update or resolve support tickets.';
//   }

//   return `You asked: "${prompt}". Later this response will come directly from OpenAI.`;
// }
