// For production debugging, every request needs a unique ID. 
// This ID is logged by Winston and returned in the response headers so you can trace a specific error in your logs.
const { v4: uuidv4 } = require('uuid');
import { Request, Response, NextFunction } from 'express';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();
  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  next();
};