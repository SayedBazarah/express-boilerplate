import * as dotenv from 'dotenv';
import { defineConfig } from '@prisma/config';

// Manually load the .env file
dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@127.0.0.1:5432/saas_db?schema=public"',
  },
});