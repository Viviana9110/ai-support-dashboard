import { NextResponse } from 'next/server';

import { rateLimit } from '@/lib/rate-limit';

const AI_RATE_LIMITS = {
  chat: 20,
  stream: 20,
  conversations: 30,
  messages: 30,
} as const;

export type AiRateLimitScope = keyof typeof AI_RATE_LIMITS;

export function checkAiRateLimit(
  userId: string,
  scope: AiRateLimitScope,
) {
  return rateLimit(`ai:${scope}:${userId}`, {
    limit: AI_RATE_LIMITS[scope],
  });
}

export function aiRateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: 'Too many AI requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSeconds),
      },
    },
  );
}
