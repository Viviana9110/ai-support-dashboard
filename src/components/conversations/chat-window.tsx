'use client';

import { Conversation } from '@/services/conversations/conversation.types';

import { useChat } from '@/hooks/use-chat';

import { ChatInput } from './chat-input';
import { ConversationHeader } from './conversation-header';
import { MessageList } from './message-list';

interface ChatWindowProps {
  conversation: Conversation;
}

export function ChatWindow({ conversation }: ChatWindowProps) {
  const chat = useChat(conversation);

  return (
    <div className="flex h-full flex-col">
      <ConversationHeader conversation={conversation} />

      <MessageList
        messages={chat.messages}
        messagesEndRef={chat.messagesEndRef}
        isTyping={chat.isTyping}
      />

      <ChatInput
        value={chat.text}
        onChange={chat.setText}
        onSend={chat.sendMessage}
      />
    </div>
  );
}
