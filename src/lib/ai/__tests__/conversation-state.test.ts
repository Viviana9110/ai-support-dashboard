import { describe, expect, it } from 'vitest';

import { resolveActiveConversationId } from '../conversation-state';

const conversations = [
  {
    id: 'conversation-1',
    title: 'First',
    customerId: null,
    createdAt: '',
    updatedAt: '',
    messageCount: 0,
    lastMessage: null,
    lastMessageRole: null,
  },
  {
    id: 'conversation-2',
    title: 'Second',
    customerId: null,
    createdAt: '',
    updatedAt: '',
    messageCount: 0,
    lastMessage: null,
    lastMessageRole: null,
  },
];

describe('AI conversation selection state', () => {
  it('selects the first conversation when no current conversation exists', () => {
    expect(resolveActiveConversationId(conversations, '')).toBe('conversation-1');
  });

  it('keeps a valid current conversation selected', () => {
    expect(resolveActiveConversationId(conversations, 'conversation-2')).toBe(
      'conversation-2',
    );
  });

  it('selects another conversation after the active one is removed', () => {
    expect(resolveActiveConversationId([conversations[1]], 'conversation-1')).toBe(
      'conversation-2',
    );
  });

  it('clears the active ID when the last conversation is removed', () => {
    expect(resolveActiveConversationId([], 'conversation-1')).toBe('');
  });
});
