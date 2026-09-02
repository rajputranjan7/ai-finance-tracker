// Simple in-memory rate limiter for Next.js API routes

interface RateLimitRecord {
  count: number;
  lastReset: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Checks rate limit for a given identifier (e.g., user ID or IP address).
 * @param identifier Unique request identifier
 * @param limit Max allowed requests within window
 * @param windowMs Time window in milliseconds (default: 60s)
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 30,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now - record.lastReset > windowMs) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count };
}
