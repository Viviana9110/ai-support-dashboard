'use client';

import { useEffect, useMemo, useState } from 'react';

import { Card } from '@/components/ui/card';

import { useAI } from '@/hooks/use-ai';
import { useConversations } from '@/hooks/use-conversations';

import { PlaygroundHeader } from './playground-header';
import { PlaygroundSidebar } from './playground-sidebar';
import { ConversationList } from './conversation-list';
import { ChatWindow } from './chat-window';
import { PromptInput } from './prompt-input';

import {
  ChatConversation,
  ChatMessage,
} from '@/services/ai/ai.types';

export function AIPlayground() {
  const { data = [], isLoading } = useAI();

  const [typing, setTyping] = useState(false);

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

  useEffect(() => {
    if (!data.length) return;

    if (conversations.length > 0) return;

    const firstConversation: ChatConversation = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      createdAt: new Date(),
      messages: data,
    };

    setConversations([firstConversation]);
    setActiveConversationId(firstConversation.id);
  }, [data, conversations.length, setConversations]);

  const activeConversation = useMemo(() => {
    return conversations.find(
      (conversation) =>
        conversation.id === activeConversationId,
    );
  }, [conversations, activeConversationId]);

  async function handleSend(prompt: string) {
    if (!activeConversation) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt,
      createdAt: new Date(),
    };

    const updatedMessages = [
      ...activeConversation.messages,
      userMessage,
    ];

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === activeConversationId
          ? {
              ...conversation,
              title:
                conversation.messages.length <= 1
                  ? prompt.slice(0, 35)
                  : conversation.title,
              messages: updatedMessages,
            }
          : conversation,
      ),
    );

    setTyping(true);

    try {
      const response = await sendMessage(prompt);
       const assistantMessage: ChatMessage = {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: response.output,
    createdAt: new Date(),

  };
   setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === activeConversationId
            ? {
                ...conversation,
                messages: [
                  ...updatedMessages,
                  assistantMessage,
                ],
              }
            : conversation,
        ),
      );
    } finally {
      setTyping(false);
    }   
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
            messages={activeConversation?.messages ?? []}
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