import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redisClient } from '../../config/redis';
import { env } from '../../config/env';
import { ApiError, HttpCode } from '../errors/api-error';
import { logger } from '../../config/logger';

// 1. Declare a variable to hold our single instance
let globalLimiterInstance: RateLimitRequestHandler;

/**
 * Called once during server bootstrap in index.ts
 */
export const initRateLimiter = (): void => {
  globalLimiterInstance = rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
      prefix: 'rl:',
    }),
    windowMs: 15 * 60 * 1000,
    max: env.NODE_ENV === 'production' ? 100 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
      next(new ApiError(HttpCode.TOO_MANY_REQUESTS, 'Too many requests, please try again later.'));
    },
  });
  
  logger.info('✅ Rate limiter initialized with Redis store');
};

/**
 * The actual middleware used in app.ts
 * It acts as a wrapper that points to our single instance
 */
export const rateLimiterMiddleware = (req: any, res: any, next: any) => {
  if (!globalLimiterInstance) {
    // Fallback if Redis is down or init failed: allow request but log it
    logger.warn('Rate limiter not initialized, bypassing check');
    return next();
  }
  return globalLimiterInstance(req, res, next);
};