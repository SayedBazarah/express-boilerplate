import { RequestHandler } from 'express';
import { NotFoundError } from '../errors/api-error';

export const notFoundHandler: RequestHandler = async (_req, _res, next) =>
  next(new NotFoundError());
