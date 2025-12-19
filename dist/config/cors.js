"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const env_1 = require("./env");
const api_error_1 = require("../core/errors/api-error");
const allowedOrigins = env_1.env.CORS_ORIGIN.split(',');
exports.corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || env_1.env.NODE_ENV === 'development') {
            callback(null, true);
        }
        else {
            callback(new api_error_1.BadRequestError('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true, // Required for cookies/sessions
    maxAge: 86400, // Preflight request cache (24 hours)
};
//# sourceMappingURL=cors.js.map