import { CorsOptions } from 'cors';
import { env } from './env';
import { BadRequestError } from '../core/errors/api-error';

const allowedOrigins = env.CORS_ORIGIN.split(',');

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new BadRequestError('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true, // Required for cookies/sessions
  maxAge: 86400, // Preflight request cache (24 hours)
};