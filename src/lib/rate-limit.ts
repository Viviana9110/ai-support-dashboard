interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitRecord>();

const DEFAULT_WINDOW_MS = 15 * 60 * 1000;

const MAX_KEYS = 10_000;

export interface RateLimitOptions {
  limit: number;
  windowMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function rateLimit(
  key: string,
  { limit, windowMs = DEFAULT_WINDOW_MS }: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();

  if (store.size > MAX_KEYS) {
    for (const [storedKey, record] of store) {
      if (record.resetAt <= now) {
        store.delete(storedKey);
      }
    }
  }

  const record = store.get(key);

  if (!record || record.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;

  return { allowed: true, retryAfterSeconds: 0 };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return request.headers.get('x-real-ip') ?? 'unknown';
}
