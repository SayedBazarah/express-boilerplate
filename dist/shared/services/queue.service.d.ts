import { JobsOptions } from 'bullmq';
export declare class QueueService {
    private queues;
    /**
     * BullMQ works best when you pass connection options
     * rather than the node-redis client instance directly.
     */
    private readonly connection;
    private getQueue;
    addJob<T>(queueName: string, jobName: string, data: T, opts?: JobsOptions): Promise<void>;
}
