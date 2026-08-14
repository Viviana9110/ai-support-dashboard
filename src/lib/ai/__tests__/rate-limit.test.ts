import { describe, expect, it } from 'vitest';

import { checkAiRateLimit } from '../rate-limit';

describe('AI rate limiting', () => {
  it('allows requests within the user bucket', () => {
    expect(checkAiRateLimit('rate-test-allowed', 'chat').allowed).toBe(true);
  });

  it('uses independent buckets for different users', () => {
    const firstUser = 'rate-test-user-a';
    const secondUser = 'rate-test-user-b';

    for (let attempt = 0; attempt < 20; attempt += 1) {
      checkAiRateLimit(firstUser, 'chat');
    }

    const blocked = checkAiRateLimit(firstUser, 'chat');
    const independent = checkAiRateLimit(secondUser, 'chat');

    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    expect(independent.allowed).toBe(true);
  });
});
