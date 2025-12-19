export declare class CacheService {
    /**
     * Type-safe retrieval from Redis
     */
    get<T>(key: string): Promise<T | null>;
    /**
     * JSON serialization and storage
     */
    set(key: string, value: unknown, ttlSeconds: number): Promise<void>;
    /**
     * Manual invalidation
     */
    delete(key: string): Promise<void>;
    /**
     * The Cache-Aside Pattern Implementation
     * Automatically fetches, caches, and returns data
     */
    wrap<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T>;
}
