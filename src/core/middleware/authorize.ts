import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/api-error';

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    // Logic for checking roles (Enable this when you add 'role' to User model)
    // if (!allowedRoles.includes(req.user.role)) {
    //   return next(new ForbiddenError('Insufficient permissions'));
    // }

    next();
  };
};
