// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimit.get(identifier);

  // Clean up expired entries
  if (record && now > record.resetTime) {
    rateLimit.delete(identifier);
  }

  const current = rateLimit.get(identifier);

  if (!current) {
    // First attempt
    rateLimit.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1, resetTime: now + windowMs };
  }

  if (current.count >= maxAttempts) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetTime: current.resetTime };
  }

  // Increment attempt count
  current.count++;
  return {
    allowed: true,
    remaining: maxAttempts - current.count,
    resetTime: current.resetTime,
  };
}

export function resetRateLimit(identifier: string): void {
  rateLimit.delete(identifier);
}
