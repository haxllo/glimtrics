import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

type RateLimitRule = {
  pattern: RegExp;
  limit?: number;
  windowMs?: number;
  skip?: boolean;
};

const RATE_LIMIT_RULES: RateLimitRule[] = [
  {
    pattern: /^\/?api\/paddle\//,
    skip: true,
  },
  {
    pattern: /^\/?api\/uploadthing\//,
    limit: 45,
    windowMs: 60_000,
  },
  {
    pattern: /^\/?api\/auth\/(login|forgot-password|reset-password)/,
    limit: 10,
    windowMs: 60_000,
  },
  {
    pattern: /^\/?api\/register/,
    limit: 5,
    windowMs: 10 * 60_000,
  },
  {
    pattern: /^\/?api\/dashboard\/bulk-delete/,
    limit: 10,
    windowMs: 5 * 60_000,
  },
];

const DEFAULT_LIMIT = 120;
const DEFAULT_WINDOW = 60_000;

function resolveRule(pathname: string): RateLimitRule | null {
  for (const rule of RATE_LIMIT_RULES) {
    if (rule.pattern.test(pathname)) {
      return rule;
    }
  }
  return null;
}

function getClientIdentifier(request: NextRequest): string {
  const headerCandidates = [
    "cf-connecting-ip",
    "x-real-ip",
    "x-forwarded-for",
  ];

  for (const header of headerCandidates) {
    const value = request.headers.get(header);
    if (value) {
      if (header === "x-forwarded-for") {
        const forwarded = value.split(",")[0]?.trim();
        if (forwarded) {
          return forwarded;
        }
      } else {
        return value;
      }
    }
  }

  if (request.ip) {
    return request.ip;
  }

  return "unknown";
}

function getBucket(pathname: string, rule: RateLimitRule | null): string {
  if (rule) {
    return rule.pattern.source;
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 2) {
    return pathname;
  }

  // Group dynamic segments to avoid bypassing the limiter with unique IDs
  const truncated = segments.slice(0, 3).map((segment) => {
    if (segment.startsWith("[")) {
      return "*";
    }
    return segment.includes("-") || segment.length > 24 ? "*" : segment;
  });

  return `/${truncated.join("/")}`;
}

export function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  const rule = resolveRule(pathname);

  if (rule?.skip) {
    return NextResponse.next();
  }

  const limit = rule?.limit ?? DEFAULT_LIMIT;
  const windowMs = rule?.windowMs ?? DEFAULT_WINDOW;
  const identifier = getClientIdentifier(request);
  const bucket = `${request.method}:${getBucket(pathname, rule)}`;
  const key = `${bucket}:${identifier}`;

  const { allowed, remaining, resetTime } = checkRateLimit(key, limit, windowMs);

  if (!allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - Date.now()) / 1000));
    const response = NextResponse.json(
      {
        error: "Too many requests",
        message: "You have reached the request limit. Please try again shortly.",
      },
      {
        status: 429,
      },
    );

    response.headers.set("Retry-After", retryAfterSeconds.toString());
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", "0");
    response.headers.set("X-RateLimit-Reset", Math.ceil(resetTime / 1000).toString());
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", limit.toString());
  response.headers.set("X-RateLimit-Remaining", Math.max(remaining, 0).toString());
  response.headers.set("X-RateLimit-Reset", Math.ceil(resetTime / 1000).toString());
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
