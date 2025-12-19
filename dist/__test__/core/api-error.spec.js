"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_1 = require("../../core/errors/api-error");
describe('ApiError', () => {
    it('should create a formatted error object', () => {
        const error = new api_error_1.ApiError(api_error_1.HttpCode.BAD_REQUEST, 'Invalid data');
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Invalid data');
    });
    it('should inherit correctly for specialized errors', () => {
        const error = new api_error_1.NotFoundError('Resource missing');
        expect(error.statusCode).toBe(404);
        expect(error.isOperational).toBe(true);
    });
});
//# sourceMappingURL=api-error.spec.js.map