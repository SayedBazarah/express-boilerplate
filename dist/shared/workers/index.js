"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWorkers = void 0;
const logger_1 = require("../../config/logger");
/**
 * Initializes and starts all background workers in the application.
 * Called during the bootstrap phase in index.ts
 */
const initWorkers = () => {
    try {
        const workers = [
        // Add more workers here as they are created
        ];
        workers.forEach((worker) => worker.start());
        logger_1.logger.info('✅ All background workers initialized');
    }
    catch (error) {
        logger_1.logger.error('❌ Failed to initialize workers:', error);
    }
};
exports.initWorkers = initWorkers;
//# sourceMappingURL=index.js.map