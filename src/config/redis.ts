import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

// 1. Initialize Redis client
export const redisClient = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  // CRITICAL FIX: Prevent auto-connection. 
  // This lets us manually control the connection in the bootstrap phase.
  lazyConnect: true, 
});

// 2. Event listeners
redisClient.on('connect', () => {
  logger.info('✅ Redis connected successfully');
});

redisClient.on('error', (err) => {
  logger.error('❌ Redis Client Error', err);
});

// 3. Robust Connect Function
export const connectRedis = async (): Promise<void> => {
  try {
    // Now we can safely call connect() without race conditions
    await redisClient.connect();
    logger.info('Infrastructure: Redis connection established');
  } catch (error) {
    logger.error('Could not establish a connection with Redis:', error);
    process.exit(1);
  }
};