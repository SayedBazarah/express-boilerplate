"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const logger_1 = require("../../config/logger");
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger_1.logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms - ${req.ip}`);
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=request-logger.js.map