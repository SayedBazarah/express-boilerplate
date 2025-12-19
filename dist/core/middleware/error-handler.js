"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const api_error_1 = require("../errors/api-error");
const logger_1 = require("../../config/logger");
const env_1 = require("../../config/env");
const errorHandler = (err, req, res, _next) => {
    const statusCode = err instanceof api_error_1.ApiError ? err.statusCode : api_error_1.HttpCode.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Internal Server Error';
    logger_1.logger.error(`[${req.method}] ${req.path} >> ${statusCode} - ${message}`);
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        ...(env_1.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map