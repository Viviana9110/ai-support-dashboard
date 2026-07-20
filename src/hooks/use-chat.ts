'use client';

import { useEffect, useRef, useState } from 'react';

import { Conversation } from '@/services/conversations/conversation.types';
import { Message } from '@/services/conversations/conversation.types';

export function useChat(conversation: Conversation) {
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(conversation.messages);
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  function sendMessage() {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: 'customer',
      text,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, newMessage]);

    setText('');

    setIsTyping(true);

    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        sender: 'agent',
        text: "Thanks for contacting support! I'm reviewing your request.",
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, reply]);

      setIsTyping(false);
    }, 1500);
  }

  return {
    messages,
    text,
    setText,
    sendMessage,
    messagesEndRef,
    isTyping,
  };
}
