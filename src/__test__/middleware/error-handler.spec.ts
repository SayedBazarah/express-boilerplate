import { logger } from '../../config/logger';
import { NotFoundError } from '../../core/errors/api-error';
import { errorHandler } from '../../core/middleware/error-handler';

describe('Core: Error Handler Middleware', () => {
  let mockRequest: any;
  let mockResponse: any;
  let nextFunction: any;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
    jest.spyOn(logger, 'error').mockImplementation(); // Silence logs in tests
  });

  it('should handle operational ApiErrors and return correct JSON', () => {
    const error = new NotFoundError('Not Found');

    errorHandler(error, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'Not Found',
      })
    );
  });


   it('should catch unhandled errors and return 500', () => {
  const error = new Error('Random crash');

  errorHandler(error, mockRequest, mockResponse, nextFunction);

  expect(mockResponse.status).toHaveBeenCalledWith(500);
  expect(mockResponse.json).toHaveBeenCalledWith(
    expect.objectContaining({
      message: 'Random crash', // Match the actual error message
      status: 'error'
    })
  );
});
});