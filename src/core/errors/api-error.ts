export enum HttpCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  TOO_MANY_REQUESTS = 429,
}

export class ApiError extends Error {
  public readonly statusCode: HttpCode;
  public readonly isOperational: boolean;

  constructor(statusCode: HttpCode, message: string, isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(HttpCode.NOT_FOUND, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad request') {
    super(HttpCode.BAD_REQUEST, message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(HttpCode.UNAUTHORIZED, message);
  }}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(HttpCode.FORBIDDEN, message);
  } 
}
export class ConflictError extends ApiError {
  constructor(message = 'Conflict') {
    super(HttpCode.CONFLICT, message);
  }}