import 'dotenv/config';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url:
      process.env.DATABASE_URL || 'postgresql://saas:password@localhost:5432/saas_db?schema=public',
  },
});
