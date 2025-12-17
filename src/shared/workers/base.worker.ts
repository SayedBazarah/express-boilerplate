import { Worker, Job, ConnectionOptions } from 'bullmq';
import { env } from '../../config/env';
import { logger } from '../../config/logger';

export abstract class BaseWorker<T> {
  protected abstract queueName: string;
  
  // BullMQ requires a dedicated connection or connection options
  private readonly connection: ConnectionOptions = {
    url: env.REDIS_URL,
    maxRetriesPerRequest: null, // Required by BullMQ
  };

  public start(): void {
    logger.info(`Worker starting for queue: ${this.queueName}`);
    
    const worker = new Worker(
      this.queueName,
      async (job: Job<T>) => {
        try {
          await this.process(job);
        } catch (error) {
          logger.error(`Critical error in ${this.queueName} (Job: ${job.id}):`, error);
          throw error; // BullMQ will handle the retry logic based on job settings
        }
      },
      { 
        connection: this.connection,
        concurrency: 5, // Process 5 jobs in parallel per process instance
        removeOnComplete: { count: 100 }, // Keep last 100 logs in Redis
        removeOnFail: { age: 24 * 3600 }  // Keep failed jobs for 24h
      }
    );

    worker.on('failed', (job, err) => {
      logger.error(`Job ${job?.id} in ${this.queueName} failed definitively: ${err.message}`);
    });
  }

  /**
   * Child classes implement this to define specific business logic
   */
  protected abstract process(job: Job<T>): Promise<void>;
}