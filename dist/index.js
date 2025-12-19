"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const workers_1 = require("./shared/workers");
const rate_limiter_1 = require("./core/middleware/rate-limiter");
/**
 * The server startup process is wrapped in an async function to
 * ensure infrastructure is ready before the HTTP server starts.
 */
async function bootstrap() {
    try {
        // 1. Validate Infrastructure Connections
        logger_1.logger.info('Connecting to infrastructure...');
        await database_1.prisma.$connect();
        logger_1.logger.info('✅ Database connection established');
        await redis_1.redisClient.connect();
        logger_1.logger.info('✅ Redis connection established');
        // 2. Initialize the Rate Limiter Singleton
        (0, rate_limiter_1.initRateLimiter)();
        logger_1.logger.info('✅ Rate Limiter initialized');
        // Start the background processors
        (0, workers_1.initWorkers)();
        // 2. Create HTTP Server
        const server = http_1.default.createServer(app_1.default);
        // 3. Start Listening
        server.listen(env_1.env.PORT, () => {
            logger_1.logger.info(`🚀 Server running in ${env_1.env.NODE_ENV} mode on port ${env_1.env.PORT}`);
            // Notify PM2 that the application is ready for traffic
            if (process.send) {
                process.send('ready');
            }
        });
        // 4. Handle Unhandled Rejections & Exceptions
        // Prevent the process from crashing without a log entry
        process.on('unhandledRejection', (reason) => {
            logger_1.logger.error('Unhandled Rejection at Promise:', reason);
            // Optional: Graceful shutdown or alert monitoring service
        });
        process.on('uncaughtException', (error) => {
            logger_1.logger.error('Uncaught Exception thrown:', error);
            gracefulShutdown(server, 'Uncaught Exception');
        });
        // 5. Setup Graceful Shutdown (SIGTERM/SIGINT)
        const signals = ['SIGTERM', 'SIGINT'];
        signals.forEach((signal) => {
            process.on(signal, () => gracefulShutdown(server, signal));
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to bootstrap application:', error);
        process.exit(1);
    }
}
/**
 * Ensures that the app stops accepting new requests but finishes
 * in-flight ones before closing database connections.
 */
async function gracefulShutdown(server, signal) {
    logger_1.logger.info(`${signal} received. Starting graceful shutdown...`);
    // 1. Stop accepting new connections
    server.close(async () => {
        logger_1.logger.info('HTTP server closed.');
        try {
            // 2. Close Database connections
            await database_1.prisma.$disconnect();
            logger_1.logger.info('Database connections closed.');
            // 3. Close Redis connection
            await redis_1.redisClient.quit();
            logger_1.logger.info('Redis connection closed.');
            logger_1.logger.info('Shutdown complete. Exiting.');
            process.exit(0);
        }
        catch (err) {
            logger_1.logger.error('Error during graceful shutdown:', err);
            process.exit(1);
        }
    });
    // Force shutdown after 30 seconds if cleanup takes too long
    setTimeout(() => {
        logger_1.logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 30000);
}
// Kick off the application
bootstrap();
//# sourceMappingURL=index.js.map