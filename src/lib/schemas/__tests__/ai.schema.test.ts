import { describe, expect, it } from 'vitest';

import { aiChatSchema } from '../ai.schema';

describe('AI chat schema', () => {
  it('rejects a non-UUID conversation ID', () => {
    const result = aiChatSchema.safeParse({
      conversationId: 'not-a-uuid',
      message: 'Hello',
    });

    expect(result.success).toBe(false);
  });

  it('accepts a valid UUID conversation ID', () => {
    const result = aiChatSchema.safeParse({
      conversationId: '55555555-5555-4555-8555-555555555555',
      message: 'Hello',
    });

    expect(result.success).toBe(true);
  });
});
