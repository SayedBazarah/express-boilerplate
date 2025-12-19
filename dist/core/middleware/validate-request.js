"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const api_error_1 = require("../errors/api-error");
const validateRequest = (schema) => {
    return (req, _res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(', ');
            return next(new api_error_1.BadRequestError(errorMessage));
        }
        req.body = value;
        next();
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validate-request.js.map