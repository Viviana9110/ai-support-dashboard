'use client';

import { useEffect, useMemo, useState } from 'react';

import { Card } from '@/components/ui/card';

import { useAI } from '@/hooks/use-ai';

import { ChatWindow } from './chat-window';
import { PromptInput } from './prompt-input';
import { PlaygroundHeader } from './playground-header';
import { PlaygroundSidebar } from './playground-sidebar';
import { ConversationList } from './conversation-list';

import {
  ChatMessage,
  Conversation,
} from '@/services/ai/ai.types';

export function AIPlayground() {
  const { data = [], isLoading } = useAI();

  const [typing, setTyping] = useState(false);

  const [assistant, setAssistant] = useState(
    'Customer Support AI',
  );

  const [model, setModel] = useState('GPT-5');

  const [temperature, setTemperature] =
    useState(0.7);

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [selectedConversationId, setSelectedConversationId] =
    useState('');

  useEffect(() => {
    if (!data.length) return;

    const firstConversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      updatedAt: new Date(),
      messages: data,
    };

    setConversations([firstConversation]);
    setSelectedConversationId(firstConversation.id);
  }, [data]);

  const activeConversation = useMemo(() => {
    return conversations.find(
      (conversation) =>
        conversation.id === selectedConversationId,
    );
  }, [conversations, selectedConversationId]);

  function handleSend(prompt: string) {
    if (!activeConversation) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt,
      createdAt: new Date(),
    };

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === selectedConversationId
          ? {
              ...conversation,
              updatedAt: new Date(),
              title:
                conversation.messages.length === 1
                  ? prompt
                  : conversation.title,
              messages: [
                ...conversation.messages,
                userMessage,
              ],
            }
          : conversation,
      ),
    );

    setTyping(true);

    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: generateFakeResponse(prompt),
        createdAt: new Date(),
      };

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id ===
          selectedConversationId
            ? {
                ...conversation,
                updatedAt: new Date(),
                messages: [
                  ...conversation.messages,
                  assistantMessage,
                ],
              }
            : conversation,
        ),
      );

      setTyping(false);
    }, 1200);
  }

  function handleNewConversation() {
    const conversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      updatedAt: new Date(),
      messages: [
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            'Hello 👋 How can I help you today?',
          createdAt: new Date(),
        },
      ],
    };

    setConversations((previous) => [
      conversation,
      ...previous,
    ]);

    setSelectedConversationId(conversation.id);
  }

  function handleClear() {
    if (!activeConversation) return;

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id ===
        selectedConversationId
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

  return (
    <Card className="overflow-hidden">

      <PlaygroundHeader />

      <div className="flex h-[700px]">

        <ConversationList
          conversations={conversations}
          selectedId={selectedConversationId}
          onSelect={setSelectedConversationId}
          onNewConversation={
            handleNewConversation
          }
        />

        <PlaygroundSidebar
          assistant={assistant}
          model={model}
          temperature={temperature}
          onAssistantChange={
            setAssistant
          }
          onModelChange={setModel}
          onTemperatureChange={
            setTemperature
          }
          onClear={handleClear}
        />

        <div className="flex flex-1 flex-col">

          <ChatWindow
            messages={
              activeConversation?.messages ??
              []
            }
            loading={typing}
          />

          <PromptInput
            onSend={handleSend}
          />

        </div>

      </div>

    </Card>
  );
}

function generateFakeResponse(prompt: string) {
  const value = prompt.toLowerCase();

  if (value.includes('password')) {
    return 'To reset your password, click on "Forgot password" from the login page.';
  }

  if (value.includes('refund')) {
    return 'Customers can request a refund within 30 days after purchase.';
  }

  if (value.includes('hello')) {
    return 'Hello 👋 How can I assist you today?';
  }

  return `You asked: "${prompt}". Later this response will come from OpenAI.`;
}