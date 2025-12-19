import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/api-error';
export declare const errorHandler: (err: Error | ApiError, req: Request, res: Response, _next: NextFunction) => void;
