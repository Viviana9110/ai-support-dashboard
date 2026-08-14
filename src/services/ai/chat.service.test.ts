import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createConversation,
  deleteConversation,
  renameConversation,
} from './chat.service';

describe('AI conversation mutation services', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it.each([
    ['create', () => createConversation('New Chat')],
    ['rename', () => renameConversation('conversation-1', 'Renamed')],
    ['delete', () => deleteConversation('conversation-1')],
  ])('rejects failed %s mutations for the UI to display', async (_name, operation) => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: 'Failure' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(operation()).rejects.toThrow();
  });

  it('keeps successful conversation creation behavior', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ id: 'conversation-1' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(createConversation('New Chat')).resolves.toEqual({
      id: 'conversation-1',
    });
  });
});
