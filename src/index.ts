import http from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/database';
import { redisClient } from './config/redis';

import { initWorkers } from './shared/workers';
import { initRateLimiter } from './core/middleware/rate-limiter';
/**
 * The server startup process is wrapped in an async function to 
 * ensure infrastructure is ready before the HTTP server starts.
 */
async function bootstrap(): Promise<void> {
  try {
    // 1. Validate Infrastructure Connections
    logger.info('Connecting to infrastructure...');
    
    await prisma.$connect();
    logger.info('✅ Database connection established');

    await redisClient.connect();
    logger.info('✅ Redis connection established');

    // 2. Initialize the Rate Limiter Singleton
    initRateLimiter();
    logger.info('✅ Rate Limiter initialized');
    
    // Start the background processors
    initWorkers();

    // 2. Create HTTP Server
    const server = http.createServer(app);

    // 3. Start Listening
    server.listen(env.PORT, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      
      // Notify PM2 that the application is ready for traffic
      if (process.send) {
        process.send('ready');
      }
    });

    // 4. Handle Unhandled Rejections & Exceptions
    // Prevent the process from crashing without a log entry
    process.on('unhandledRejection', (reason: Error) => {
      logger.error('Unhandled Rejection at Promise:', reason);
      // Optional: Graceful shutdown or alert monitoring service
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception thrown:', error);
      gracefulShutdown(server, 'Uncaught Exception');
    });

    // 5. Setup Graceful Shutdown (SIGTERM/SIGINT)
    const signals = ['SIGTERM', 'SIGINT'];
    signals.forEach((signal) => {
      process.on(signal, () => gracefulShutdown(server, signal));
    });

  } catch (error) {
    logger.error('Failed to bootstrap application:', error);
    process.exit(1);
  }
}

/**
 * Ensures that the app stops accepting new requests but finishes 
 * in-flight ones before closing database connections.
 */
async function gracefulShutdown(server: http.Server, signal: string): Promise<void> {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  // 1. Stop accepting new connections
  server.close(async () => {
    logger.info('HTTP server closed.');

    try {
      // 2. Close Database connections
      await prisma.$disconnect();
      logger.info('Database connections closed.');

      // 3. Close Redis connection
      await redisClient.quit();
      logger.info('Redis connection closed.');

      logger.info('Shutdown complete. Exiting.');
      process.exit(0);
    } catch (err) {
      logger.error('Error during graceful shutdown:', err);
      process.exit(1);
    }
  });

  // Force shutdown after 30 seconds if cleanup takes too long
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
}

// Kick off the application
bootstrap();