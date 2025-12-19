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
export declare const sendSuccess: <T>(res: Response, data: T, code?: HttpCode, meta?: ApiResponse<T>["meta"]) => void;
