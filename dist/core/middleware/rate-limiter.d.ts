/**
 * Called once during server bootstrap in index.ts
 */
export declare const initRateLimiter: () => void;
/**
 * The actual middleware used in app.ts
 * It acts as a wrapper that points to our single instance
 */
export declare const rateLimiterMiddleware: (req: any, res: any, next: any) => any;
