import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { env } from '../../config/env';
import { UnauthorizedError, ForbiddenError } from '../errors/api-error';
import { prisma } from '../../config/database';

// Ensure JWT_SECRET is encoded for 'jose'
const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or invalid authorization header'));
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Verify Token Signature & Expiration using 'jose'
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // 2. Validate Payload Structure
    if (!payload || typeof payload !== 'object' || !payload.sub) {
      return next(new UnauthorizedError('Invalid token payload'));
    }

    // 3. Retrieve User Info from Payload
    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
    });

    if (!user) {
      return next(new ForbiddenError('User no longer exists'));
    }
    // 4. Attach User Payload to Request
    // These keys match what you signed in AuthService.generateTokenPair
    req.user = user;

    next();
  } catch (error) {
    // jose throws specific errors for expiry/invalid signature
    // We wrap them in our generic 401 Unauthorized error
    return next(new UnauthorizedError('Invalid or expired token'));
  }
};
