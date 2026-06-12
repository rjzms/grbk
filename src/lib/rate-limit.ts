// 登录限流器 — 基于内存的简易实现
// 生产环境可替换为 Redis 方案

import { LOGIN_RATE_LIMIT_WINDOW_MS, LOGIN_RATE_LIMIT_MAX_ATTEMPTS } from "./constants";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// 定时清理过期记录（每 5 分钟）
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function checkRateLimit(key: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, {
      count: 1,
      resetAt: now + LOGIN_RATE_LIMIT_WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: LOGIN_RATE_LIMIT_MAX_ATTEMPTS - 1,
      resetAt: now + LOGIN_RATE_LIMIT_WINDOW_MS,
    };
  }

  entry.count++;

  if (entry.count > LOGIN_RATE_LIMIT_MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  return {
    allowed: true,
    remaining: LOGIN_RATE_LIMIT_MAX_ATTEMPTS - entry.count,
    resetAt: entry.resetAt,
  };
}
