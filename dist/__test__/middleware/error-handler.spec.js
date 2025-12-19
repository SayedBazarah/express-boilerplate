"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../config/logger");
const api_error_1 = require("../../core/errors/api-error");
const error_handler_1 = require("../../core/middleware/error-handler");
describe('Core: Error Handler Middleware', () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;
    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        nextFunction = jest.fn();
        jest.spyOn(logger_1.logger, 'error').mockImplementation(); // Silence logs in tests
    });
    it('should handle operational ApiErrors and return correct JSON', () => {
        const error = new api_error_1.NotFoundError('Not Found');
        (0, error_handler_1.errorHandler)(error, mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            status: 'error',
            message: 'Not Found',
        }));
    });
    it('should catch unhandled errors and return 500', () => {
        const error = new Error('Random crash');
        (0, error_handler_1.errorHandler)(error, mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Random crash', // Match the actual error message
            status: 'error'
        }));
    });
});
//# sourceMappingURL=error-handler.spec.js.map