import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var __glimtrics_redis__: Redis | undefined;
}

export function getRedisConnection(): Redis {
  const url =
    process.env.REDIS_URL ??
    process.env.UPSTASH_REDIS_URL ??
    "redis://127.0.0.1:6379";

  const isTls = url.startsWith("rediss://");

  if (!global.__glimtrics_redis__) {
    global.__glimtrics_redis__ = new Redis(url, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: false,
      ...(isTls
        ? {
            tls: {
              // Upstash requires TLS but uses self-signed certs; allow but rely on URL creds
              rejectUnauthorized: false,
            },
          }
        : {}),
    });
  }

  return global.__glimtrics_redis__;
}

export type RedisConnection = ReturnType<typeof getRedisConnection>;
