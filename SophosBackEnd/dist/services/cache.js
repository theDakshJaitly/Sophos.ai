"use strict";
// In SophosBackEnd/src/services/cache.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFromCache = getFromCache;
exports.storeInCache = storeInCache;
// A simple in-memory cache to store API responses during development.
// NOTE: This will reset every time the server restarts.
const cache = new Map();
function getFromCache(key) {
    if (cache.has(key)) {
        console.log(`[Cache] HIT for key: ${key}`);
        return cache.get(key);
    }
    console.log(`[Cache] MISS for key: ${key}`);
    return null;
}
function storeInCache(key, value) {
    console.log(`[Cache] Storing value for key: ${key}`);
    cache.set(key, value);
}
