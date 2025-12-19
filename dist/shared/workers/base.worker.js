"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseWorker = void 0;
const bullmq_1 = require("bullmq");
const env_1 = require("../../config/env");
const logger_1 = require("../../config/logger");
class BaseWorker {
    // BullMQ requires a dedicated connection or connection options
    connection = {
        url: env_1.env.REDIS_URL,
        maxRetriesPerRequest: null, // Required by BullMQ
    };
    start() {
        logger_1.logger.info(`Worker starting for queue: ${this.queueName}`);
        const worker = new bullmq_1.Worker(this.queueName, async (job) => {
            try {
                await this.process(job);
            }
            catch (error) {
                logger_1.logger.error(`Critical error in ${this.queueName} (Job: ${job.id}):`, error);
                throw error; // BullMQ will handle the retry logic based on job settings
            }
        }, {
            connection: this.connection,
            concurrency: 5, // Process 5 jobs in parallel per process instance
            removeOnComplete: { count: 100 }, // Keep last 100 logs in Redis
            removeOnFail: { age: 24 * 3600 } // Keep failed jobs for 24h
        });
        worker.on('failed', (job, err) => {
            logger_1.logger.error(`Job ${job?.id} in ${this.queueName} failed definitively: ${err.message}`);
        });
    }
}
exports.BaseWorker = BaseWorker;
//# sourceMappingURL=base.worker.js.map