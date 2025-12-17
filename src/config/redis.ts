import { createClient } from 'redis';
import { env } from './env';
import { logger } from './logger';

export const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis connected successfully'));

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('Could not establish a connection with Redis:', error);
    // In production, you might want to allow the app to run without Redis 
    // depending on how critical it is for your business logic.
  }
};