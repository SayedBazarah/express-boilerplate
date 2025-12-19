"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const redis_1 = require("../../config/redis");
const logger_1 = require("../../config/logger");
class CacheService {
    /**
     * Type-safe retrieval from Redis
     */
    async get(key) {
        try {
            const data = await redis_1.redisClient.get(key);
            if (!data) {
                logger_1.logger.debug(`Cache Miss: ${key}`);
                return null;
            }
            logger_1.logger.debug(`Cache Hit: ${key}`);
            return JSON.parse(data);
        }
        catch (error) {
            logger_1.logger.error(`Redis Get Error [Key: ${key}]:`, error);
            return null; // Return null so the app can fallback to DB
        }
    }
    /**
     * JSON serialization and storage
     */
    async set(key, value, ttlSeconds) {
        try {
            const serialized = JSON.stringify(value);
            await redis_1.redisClient.setEx(key, ttlSeconds, serialized);
            logger_1.logger.debug(`Cache Set: ${key} (TTL: ${ttlSeconds}s)`);
        }
        catch (error) {
            logger_1.logger.error(`Redis Set Error [Key: ${key}]:`, error);
        }
    }
    /**
     * Manual invalidation
     */
    async delete(key) {
        try {
            await redis_1.redisClient.del(key);
            logger_1.logger.debug(`Cache Delete: ${key}`);
        }
        catch (error) {
            logger_1.logger.error(`Redis Delete Error [Key: ${key}]:`, error);
        }
    }
    /**
     * The Cache-Aside Pattern Implementation
     * Automatically fetches, caches, and returns data
     */
    async wrap(key, ttl, fetcher) {
        const cached = await this.get(key);
        if (cached)
            return cached;
        // Logic for Cache Miss
        const freshData = await fetcher();
        // We don't 'await' the set operation here so we don't block the API response
        this.set(key, freshData, ttl).catch((err) => logger_1.logger.error(`Deferred Cache Set Error: ${err}`));
        return freshData;
    }
}
exports.CacheService = CacheService;
//# sourceMappingURL=cache.service.js.map