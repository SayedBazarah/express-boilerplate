"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiterMiddleware = exports.initRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = require("rate-limit-redis");
const redis_1 = require("../../config/redis");
const env_1 = require("../../config/env");
const api_error_1 = require("../errors/api-error");
const logger_1 = require("../../config/logger");
// 1. Declare a variable to hold our single instance
let globalLimiterInstance;
/**
 * Called once during server bootstrap in index.ts
 */
const initRateLimiter = () => {
    globalLimiterInstance = (0, express_rate_limit_1.default)({
        store: new rate_limit_redis_1.RedisStore({
            sendCommand: (...args) => redis_1.redisClient.sendCommand(args),
            prefix: 'rl:',
        }),
        windowMs: 15 * 60 * 1000,
        max: env_1.env.NODE_ENV === 'production' ? 100 : 1000,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (_req, _res, next) => {
            next(new api_error_1.ApiError(api_error_1.HttpCode.TOO_MANY_REQUESTS, 'Too many requests, please try again later.'));
        },
    });
    logger_1.logger.info('✅ Rate limiter initialized with Redis store');
};
exports.initRateLimiter = initRateLimiter;
/**
 * The actual middleware used in app.ts
 * It acts as a wrapper that points to our single instance
 */
const rateLimiterMiddleware = (req, res, next) => {
    if (!globalLimiterInstance) {
        // Fallback if Redis is down or init failed: allow request but log it
        logger_1.logger.warn('Rate limiter not initialized, bypassing check');
        return next();
    }
    return globalLimiterInstance(req, res, next);
};
exports.rateLimiterMiddleware = rateLimiterMiddleware;
//# sourceMappingURL=rate-limiter.js.map