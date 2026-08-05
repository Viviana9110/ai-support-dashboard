'use client';

import { useEffect, useRef, useState } from 'react';

import { Conversation } from '@/services/conversations/conversation.types';

import { useSendMessage } from '@/hooks/use-send-message';

import { ChatInput } from './chat-input';
import { ConversationHeader } from './conversation-header';
import { MessageList } from './message-list';

interface ChatWindowProps {
  conversation: Conversation;
}

export function ChatWindow({ conversation }: ChatWindowProps) {
  const sendMessage = useSendMessage();

  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.id, conversation.messages.length]);

  async function handleSend() {
    if (!text.trim() || sendMessage.isPending) return;

    try {
      await sendMessage.mutateAsync({
        conversationId: conversation.id,
        sender: 'agent',
        text: text.trim(),
      });

      setText('');
    } catch {
      // Keep the text so the user can retry after a failure.
    }
  }

  return (
    <div className="flex h-full flex-col">
      <ConversationHeader conversation={conversation} />

      <MessageList
        messages={conversation.messages}
        messagesEndRef={messagesEndRef}
      />

      <ChatInput
        value={text}
        onChange={setText}
        onSend={handleSend}
        disabled={sendMessage.isPending}
      />
    </div>
  );
}
