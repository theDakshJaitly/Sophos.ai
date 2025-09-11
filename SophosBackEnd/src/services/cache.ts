// In SophosBackEnd/src/services/cache.ts

// A simple in-memory cache to store API responses during development.
// NOTE: This will reset every time the server restarts.
const cache = new Map<string, any>();

export function getFromCache(key: string): any | null {
  if (cache.has(key)) {
    console.log(`[Cache] HIT for key: ${key}`);
    return cache.get(key);
  }
  console.log(`[Cache] MISS for key: ${key}`);
  return null;
}

export function storeInCache(key: string, value: any) {
  console.log(`[Cache] Storing value for key: ${key}`);
  cache.set(key, value);
}