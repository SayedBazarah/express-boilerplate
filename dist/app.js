"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const security_1 = require("./core/middleware/security");
const request_id_1 = require("./core/middleware/request-id");
const request_logger_1 = require("./core/middleware/request-logger");
const error_handler_1 = require("./core/middleware/error-handler");
const cors_2 = require("./config/cors");
const user_routes_1 = require("./features/users/api/user.routes");
const rate_limiter_1 = require("./core/middleware/rate-limiter");
const app = (0, express_1.default)();
// 1. Traceability & Security
app.use(request_id_1.requestIdMiddleware);
app.use(security_1.securityMiddleware);
app.use((0, cors_1.default)(cors_2.corsOptions));
// 2. Performance & Limiting
app.use(rate_limiter_1.rateLimiterMiddleware);
app.use(express_1.default.json({ limit: '10kb' })); // Body limit to prevent DoS
// 3. Logging
app.use(request_logger_1.requestLogger);
// 4. Feature Routes (to be added)
app.use('/api/v1/users', user_routes_1.userRoutes);
// 5. Global Error Handling
app.use(error_handler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map