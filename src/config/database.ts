import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { env } from './env';
import { logger } from './logger';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // Cloud proxies like db.prisma.io need more time to respond
  connectionTimeoutMillis: 15000, 
  idleTimeoutMillis: 30000,
  // CRITICAL: Remote proxies REQUIRE SSL
  ssl: {
    rejectUnauthorized: false // Allows connection to the Prisma proxy certificate
  }
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle PostgreSQL client', err);
});

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

export const connectDatabase = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    logger.info('✅ Connected to Prisma Cloud Database');
    client.release();
  } catch (error) {
    logger.error('❌ Failed to connect to Prisma Cloud DB. Check if your internet is stable.');
    logger.error(error);
    process.exit(1);
  }
};