"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rate_limiter_1 = require("../../core/middleware/rate-limiter");
describe('Core: Rate Limiter', () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;
    beforeEach(() => {
        mockRequest = {};
        mockResponse = {};
        nextFunction = jest.fn();
    });
    it('should allow request to pass even if not initialized (resilience check)', () => {
        // We don't call initRateLimiter() here
        (0, rate_limiter_1.rateLimiterMiddleware)(mockRequest, mockResponse, nextFunction);
        expect(nextFunction).toHaveBeenCalled();
    });
});
//# sourceMappingURL=rate-limiter.spec.js.map