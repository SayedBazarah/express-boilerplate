import { Response } from 'express';
import { HttpCode } from '../errors/api-error';

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  code: HttpCode = HttpCode.OK,
  meta?: ApiResponse<T>['meta']
): void => {
  res.status(code).json({
    success: true,
    data,
    ...(meta && { meta }),
  });
};