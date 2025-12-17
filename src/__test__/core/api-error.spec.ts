import { ApiError, HttpCode, NotFoundError } from "../../core/errors/api-error";

describe('ApiError', () => {
  it('should create a formatted error object', () => {
    const error = new ApiError(HttpCode.BAD_REQUEST, 'Invalid data');
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Invalid data');
  });

  it('should inherit correctly for specialized errors', () => {
    const error = new NotFoundError('Resource missing');
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(true);
  });
});