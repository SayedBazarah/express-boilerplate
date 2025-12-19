import { Job } from 'bullmq';
export declare abstract class BaseWorker<T> {
    protected abstract queueName: string;
    private readonly connection;
    start(): void;
    /**
     * Child classes implement this to define specific business logic
     */
    protected abstract process(job: Job<T>): Promise<void>;
}
