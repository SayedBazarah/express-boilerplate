import { Queue, JobsOptions, ConnectionOptions } from 'bullmq';
import { env } from '../../config/env';
import { logger } from '../../config/logger';

export class QueueService {
  private queues: Map<string, Queue> = new Map();

  /**
   * BullMQ works best when you pass connection options 
   * rather than the node-redis client instance directly.
   */
  private readonly connection: ConnectionOptions = {
    url: env.REDIS_URL,
    // For BullMQ specifically, ensure maxRetriesPerRequest is null 
    // as per BullMQ requirements when using a redis client
    maxRetriesPerRequest: null,
  };

  private getQueue(queueName: string): Queue {
    if (!this.queues.has(queueName)) {
      const queue = new Queue(queueName, {
        connection: this.connection,
      });
      this.queues.set(queueName, queue);
    }
    return this.queues.get(queueName)!;
  }

  async addJob<T>(
    queueName: string, 
    jobName: string, 
    data: T, 
    opts?: JobsOptions // Corrected type name
  ): Promise<void> {
    try {
      const queue = this.getQueue(queueName);
      await queue.add(jobName, data, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
        ...opts,
      });
      logger.info(`Job added to queue [${queueName}]: ${jobName}`);
    } catch (error) {
      logger.error(`Failed to add job to ${queueName}:`, error);
    }
  }
}