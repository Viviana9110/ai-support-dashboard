import { describe, expect, it, vi } from 'vitest';

import { handleAiStreamEvent } from './use-ai-stream';

describe('AI stream event handling', () => {
  it('delivers stream errors to the active UI handler', () => {
    const onError = vi.fn();

    const result = handleAiStreamEvent(
      { type: 'error' },
      2,
      2,
      {
        onDelta: vi.fn(),
        onDone: vi.fn(),
        onError,
      },
    );

    expect(result).toBe('error');
    expect(onError).toHaveBeenCalledOnce();
  });

  it('does not apply an event from a stale stream token', () => {
    const onDelta = vi.fn();
    const onDone = vi.fn();
    const onError = vi.fn();

    const result = handleAiStreamEvent(
      { type: 'delta', content: 'stale' },
      1,
      2,
      { onDelta, onDone, onError },
    );

    expect(result).toBe('stale');
    expect(onDelta).not.toHaveBeenCalled();
    expect(onDone).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('continues normal delta and done events', () => {
    const onDelta = vi.fn();
    const onDone = vi.fn();
    const onError = vi.fn();
    const handlers = { onDelta, onDone, onError };

    expect(
      handleAiStreamEvent(
        { type: 'delta', content: 'hello' },
        1,
        1,
        handlers,
      ),
    ).toBe('continue');
    expect(
      handleAiStreamEvent(
        { type: 'done' },
        1,
        1,
        handlers,
      ),
    ).toBe('done');
    expect(onDelta).toHaveBeenCalledWith('hello');
    expect(onDone).toHaveBeenCalledOnce();
    expect(onError).not.toHaveBeenCalled();
  });
});
