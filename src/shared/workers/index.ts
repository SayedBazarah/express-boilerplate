import { logger } from '../../config/logger';

/**
 * Initializes and starts all background workers in the application.
 * Called during the bootstrap phase in index.ts
 */
export const initWorkers = (): void => {
  try {
    const workers = [
      // Add more workers here as they are created
    ] as any[];

    workers.forEach((worker) => worker.start());
    logger.info('✅ All background workers initialized');
  } catch (error) {
    logger.error('❌ Failed to initialize workers:', error);
  }
};