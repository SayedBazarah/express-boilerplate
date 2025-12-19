export declare enum HttpCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
    TOO_MANY_REQUESTS = 429
}
export declare class ApiError extends Error {
    readonly statusCode: HttpCode;
    readonly isOperational: boolean;
    constructor(statusCode: HttpCode, message: string, isOperational?: boolean);
}
export declare class NotFoundError extends ApiError {
    constructor(message?: string);
}
export declare class BadRequestError extends ApiError {
    constructor(message?: string);
}
export declare class UnauthorizedError extends ApiError {
    constructor(message?: string);
}
export declare class ForbiddenError extends ApiError {
    constructor(message?: string);
}
export declare class ConflictError extends ApiError {
    constructor(message?: string);
}
