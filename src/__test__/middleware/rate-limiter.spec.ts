import { rateLimiterMiddleware } from "../../core/middleware/rate-limiter";

describe('Core: Rate Limiter', () => {
  let mockRequest: any;
  let mockResponse: any;
  let nextFunction: any;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it('should allow request to pass even if not initialized (resilience check)', () => {
    // We don't call initRateLimiter() here
    rateLimiterMiddleware(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
});