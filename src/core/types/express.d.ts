import { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      // Use the Prisma User type but omit sensitive fields
      user?: Omit<PrismaUser, 'password'>;
      requestId?: string;
    }
  }
}