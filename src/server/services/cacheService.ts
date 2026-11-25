interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  storedAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

/**
 * Simple in-memory TTL cache for server-side market API responses.
 */
export function getCached<T>(key: string): { value: T; isStale: boolean; storedAt: number } | null {
  const entry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  const now = Date.now();
  return {
    value: entry.value,
    isStale: now > entry.expiresAt,
    storedAt: entry.storedAt,
  };
}

export function setCached<T>(key: string, value: T, ttlMs: number): void {
  const now = Date.now();
  memoryCache.set(key, {
    value,
    expiresAt: now + ttlMs,
    storedAt: now,
  });
}
