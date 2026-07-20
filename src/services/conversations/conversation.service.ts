import { Conversation } from './conversation.types';

export async function getConversations(): Promise<Conversation[]> {
  return [
    {
      id: 1,
      customer: 'John Doe',
      avatar: 'JD',
      online: true,
      unread: 2,
      lastMessage: 'I need help with my order.',
      messages: [
        {
          id: 1,
          sender: 'customer',
          text: 'Hello',
          time: '09:00',
        },
        {
          id: 2,
          sender: 'agent',
          text: 'Hi John! How can I help?',
          time: '09:01',
        },
        {
          id: 3,
          sender: 'customer',
          text: 'I need help with my order.',
          time: '09:03',
        },
      ],
    },

    {
      id: 2,
      customer: 'Sarah Lee',
      avatar: 'SL',
      online: false,
      unread: 0,
      lastMessage: 'Thanks!',
      messages: [
        {
          id: 1,
          sender: 'customer',
          text: 'Payment failed',
          time: '08:00',
        },
        {
          id: 2,
          sender: 'agent',
          text: 'Please try again.',
          time: '08:03',
        },
      ],
    },
  ];
}
