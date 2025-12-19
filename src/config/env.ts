import joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL: string;
  CORS_ORIGIN: string;
  LOG_LEVEL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
}

const envSchema = joi.object({
  NODE_ENV: joi.string().valid('development', 'production', 'test').required(),
  PORT: joi.number().port().default(3000),
  DATABASE_URL: joi.string().uri().required(),
  REDIS_URL: joi.string().uri().required(),
  CORS_ORIGIN: joi.string().required(),
  LOG_LEVEL: joi.string().valid('error', 'warn', 'info', 'http', 'debug').default('info'),
  // ----
  JWT_SECRET: joi.string().min(32).required(),
  JWT_REFRESH_SECRET: joi.string().min(32).required(),
  // ----
}).unknown();

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env: EnvConfig = value;