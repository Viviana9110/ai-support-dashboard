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
  useCreateAiConversation,
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

  const [activeConversationId, setActiveConversationId] =
    useState('');

  const [streamingText, setStreamingText] =
    useState('');

  const { startStream, cancelStream, isStreaming } =
    useAiStream();

  useEffect(() => {
    cancelStream();
    setStreamingText('');
  }, [activeConversationId, cancelStream]);

  const queryClient = useQueryClient();

  const createAiConversation = useCreateAiConversation();

  const {
    data: detail,
    isLoading: isDetailLoading,
    isError: isDetailError,
    refetch: refetchDetail,
  } = useAiConversation(activeConversationId);

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

    startStream({
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
      },
    });
  }

  async function handleNewConversation() {
    const created = await createAiConversation.mutateAsync('New Chat');

    setActiveConversationId(created.id);
  }

  function handleClear() {
    if (!activeConversationId) return;

    queryClient.setQueryData<Conversation>(
      ['ai-conversations', activeConversationId],
      (previous) =>
        previous
          ? { ...previous, messages: [] }
          : previous,
    );
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
        <PlaygroundHeader />

        <div className="flex h-[700px] items-center justify-center p-8">
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
    <Card className="overflow-hidden">
      <PlaygroundHeader />

      <div className="flex h-[700px]">
        <div className="w-72 border-r p-4">
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
          onAssistantChange={setAssistant}
          onModelChange={setModel}
          onTemperatureChange={setTemperature}
          onClear={handleClear}
        />

        <div className="flex flex-1 flex-col">
          <ChatWindow
            messages={messages}
            loading={isStreaming && streamingText.length === 0}
          />

          <PromptInput
            onSend={handleSend}
            disabled={isStreaming}
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