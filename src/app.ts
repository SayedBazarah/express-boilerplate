import express from 'express';
import cors from 'cors';
import { securityMiddleware } from './core/middleware/security';
import { requestIdMiddleware } from './core/middleware/request-id';
import { requestLogger } from './core/middleware/request-logger';
import { errorHandler } from './core/middleware/error-handler';
import { corsOptions } from './config/cors';
import { authRoutes } from './features/auth/api/auth.routes';
import { userRoutes } from './features/users/api/user.routes';
import { rateLimiterMiddleware } from './core/middleware/rate-limiter';

const app = express();

// 1. Traceability & Security
app.use(requestIdMiddleware);
app.use(securityMiddleware);
app.use(cors(corsOptions));

// 2. Performance & Limiting
app.use(rateLimiterMiddleware);
app.use(express.json({ limit: '10kb' })); // Body limit to prevent DoS

// 3. Logging
app.use(requestLogger);

// 4. Feature Routes (to be added)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// 5. Global Error Handling
app.use(errorHandler);

export default app;