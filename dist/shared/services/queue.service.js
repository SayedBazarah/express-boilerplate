"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const bullmq_1 = require("bullmq");
const env_1 = require("../../config/env");
const logger_1 = require("../../config/logger");
class QueueService {
    queues = new Map();
    /**
     * BullMQ works best when you pass connection options
     * rather than the node-redis client instance directly.
     */
    connection = {
        url: env_1.env.REDIS_URL,
        // For BullMQ specifically, ensure maxRetriesPerRequest is null 
        // as per BullMQ requirements when using a redis client
        maxRetriesPerRequest: null,
    };
    getQueue(queueName) {
        if (!this.queues.has(queueName)) {
            const queue = new bullmq_1.Queue(queueName, {
                connection: this.connection,
            });
            this.queues.set(queueName, queue);
        }
        return this.queues.get(queueName);
    }
    async addJob(queueName, jobName, data, opts // Corrected type name
    ) {
        try {
            const queue = this.getQueue(queueName);
            await queue.add(jobName, data, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 1000 },
                removeOnComplete: true,
                ...opts,
            });
            logger_1.logger.info(`Job added to queue [${queueName}]: ${jobName}`);
        }
        catch (error) {
            logger_1.logger.error(`Failed to add job to ${queueName}:`, error);
        }
    }
}
exports.QueueService = QueueService;
//# sourceMappingURL=queue.service.js.map