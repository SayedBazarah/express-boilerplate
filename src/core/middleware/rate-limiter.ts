import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../config/logger';
import { redisClient } from '../../config/redis';

// Variable to hold the single instance
let globalLimiterInstance: RateLimitRequestHandler;

/**
 * Called once during server bootstrap (e.g., in index.ts)
 */
export const initRateLimiter = (): void => {
  globalLimiterInstance = rateLimit({
  store: new RedisStore({
    // FIX: Cast 'args' to a tuple to satisfy ioredis.call signature
    // AND cast the result to 'any' to satisfy the return type
    sendCommand: (...args: string[]) => redisClient.call(...(args as [string, ...string[]])) as any,
    prefix: 'rl:',
  }),
  // ... rest of config
});
  
  logger.info('✅ Rate limiter initialized with Redis store');
};

/**
 * The middleware wrapper to use in app.ts
 */
export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!globalLimiterInstance) {
    logger.warn('Rate limiter not initialized, bypassing check');
    return next();
  }
  return globalLimiterInstance(req, res, next);
};