import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
export declare const validateRequest: (schema: Schema) => (req: Request, _res: Response, next: NextFunction) => void;
