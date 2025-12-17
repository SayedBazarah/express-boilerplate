import { Request, Response, NextFunction } from 'express';
import { ApiError, HttpCode } from '../errors/api-error';
import { logger } from '../../config/logger';
import { env } from '../../config/env';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err instanceof ApiError ? err.statusCode : HttpCode.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  logger.error(`[${req.method}] ${req.path} >> ${statusCode} - ${message}`);

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};