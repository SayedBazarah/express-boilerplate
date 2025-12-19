"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const env_1 = require("./env");
const logger_1 = require("./logger");
exports.redisClient = (0, redis_1.createClient)({
    url: env_1.env.REDIS_URL,
});
exports.redisClient.on('error', (err) => logger_1.logger.error('Redis Client Error', err));
exports.redisClient.on('connect', () => logger_1.logger.info('Redis connected successfully'));
const connectRedis = async () => {
    try {
        await exports.redisClient.connect();
    }
    catch (error) {
        logger_1.logger.error('Could not establish a connection with Redis:', error);
        // In production, you might want to allow the app to run without Redis 
        // depending on how critical it is for your business logic.
    }
};
exports.connectRedis = connectRedis;
//# sourceMappingURL=redis.js.map