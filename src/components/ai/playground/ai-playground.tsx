'use client';

import { useEffect, useMemo, useState } from 'react';

import { AlertTriangle, MessageSquare, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';

import {
  useAiConversation,
  useAiConversations,
  useAiSendMessage,
} from '@/hooks/use-ai-conversations';
import { useConversations } from '@/hooks/use-conversations';

import { PlaygroundHeader } from './playground-header';
import { PlaygroundSidebar } from './playground-sidebar';
import { ConversationList } from './conversation-list';
import { ChatWindow } from './chat-window';
import { PromptInput } from './prompt-input';

import {
  ChatConversation,
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

  const {
    conversations,
    setConversations,
    createConversation,
  } = useConversations();

  const [activeConversationId, setActiveConversationId] =
    useState('');

  const sendAiMessage = useAiSendMessage();

  const {
    data: detail,
    isLoading: isDetailLoading,
    isError: isDetailError,
    refetch: refetchDetail,
  } = useAiConversation(activeConversationId);

  useEffect(() => {
    if (!data.length) return;

    if (conversations.length > 0) return;

    const loadedConversations: ChatConversation[] = data.map((conversation) => ({
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      messages: [],
    }));

    setConversations(loadedConversations);
    setActiveConversationId(loadedConversations[0].id);
  }, [data, conversations.length, setConversations]);

  const activeConversation = useMemo(() => {
    return conversations.find(
      (conversation) =>
        conversation.id === activeConversationId,
    );
  }, [conversations, activeConversationId]);

  async function handleSend(prompt: string) {
    if (!activeConversation) return;

    await sendAiMessage.mutateAsync({
      id: activeConversation.id,
      content: prompt,
      role: 'user',
    });
  }

  function handleNewConversation() {
    const id = createConversation();

    setActiveConversationId(id);
  }

  function handleClear() {
    if (!activeConversation) return;

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === activeConversationId
          ? {
              ...conversation,
              messages: [],
            }
          : conversation,
      ),
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

  if (conversations.length === 0) {
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
            messages={detail?.messages ?? []}
            loading={sendAiMessage.isPending}
          />

          <PromptInput
            onSend={handleSend}
            disabled={sendAiMessage.isPending}
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