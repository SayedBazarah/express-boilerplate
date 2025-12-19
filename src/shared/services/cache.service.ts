import { redisClient } from '../../config/redis';
import { logger } from '../../config/logger';

export class CacheService {
  /**
   * Type-safe retrieval from Redis
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      if (!data) {
        logger.debug(`Cache Miss: ${key}`);
        return null;
      }
      logger.debug(`Cache Hit: ${key}`);
      return JSON.parse(data) as T;
    } catch (error) {
      logger.error(`Redis Get Error [Key: ${key}]:`, error);
      return null; // Return null so the app can fallback to DB
    }
  }

  /**
   * JSON serialization and storage
   * FIXED: Uses ioredis syntax for TTL
   */
  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      
      // FIX: ioredis uses 'set' with options, not 'setEx'
      // Syntax: client.set(key, value, 'EX', ttlInSeconds)
      await redisClient.set(key, serialized, 'EX', ttlSeconds);
      
      logger.debug(`Cache Set: ${key} (TTL: ${ttlSeconds}s)`);
    } catch (error) {
      logger.error(`Redis Set Error [Key: ${key}]:`, error);
    }
  }

  /**
   * Manual invalidation
   */
  async delete(key: string): Promise<void> {
    try {
      await redisClient.del(key);
      logger.debug(`Cache Delete: ${key}`);
    } catch (error) {
      logger.error(`Redis Delete Error [Key: ${key}]:`, error);
    }
  }

  /**
   * The Cache-Aside Pattern Implementation
   * Automatically fetches, caches, and returns data
   */
  async wrap<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) return cached;

    // Logic for Cache Miss
    const freshData = await fetcher();
    
    // We don't 'await' the set operation here so we don't block the API response
    this.set(key, freshData, ttl).catch((err) => 
      logger.error(`Deferred Cache Set Error: ${err}`)
    );

    return freshData;
  }
}