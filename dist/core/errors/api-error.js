"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.NotFoundError = exports.ApiError = exports.HttpCode = void 0;
var HttpCode;
(function (HttpCode) {
    HttpCode[HttpCode["OK"] = 200] = "OK";
    HttpCode[HttpCode["CREATED"] = 201] = "CREATED";
    HttpCode[HttpCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpCode[HttpCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpCode[HttpCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpCode[HttpCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpCode[HttpCode["CONFLICT"] = 409] = "CONFLICT";
    HttpCode[HttpCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HttpCode[HttpCode["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
})(HttpCode || (exports.HttpCode = HttpCode = {}));
class ApiError extends Error {
    statusCode;
    isOperational;
    constructor(statusCode, message, isOperational = true) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
class NotFoundError extends ApiError {
    constructor(message = 'Resource not found') {
        super(HttpCode.NOT_FOUND, message);
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends ApiError {
    constructor(message = 'Bad request') {
        super(HttpCode.BAD_REQUEST, message);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized') {
        super(HttpCode.UNAUTHORIZED, message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends ApiError {
    constructor(message = 'Forbidden') {
        super(HttpCode.FORBIDDEN, message);
    }
}
exports.ForbiddenError = ForbiddenError;
class ConflictError extends ApiError {
    constructor(message = 'Conflict') {
        super(HttpCode.CONFLICT, message);
    }
}
exports.ConflictError = ConflictError;
//# sourceMappingURL=api-error.js.map