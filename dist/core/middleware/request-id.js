"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = void 0;
// For production debugging, every request needs a unique ID. 
// This ID is logged by Winston and returned in the response headers so you can trace a specific error in your logs.
const { v4: uuidv4 } = require('uuid');
const requestIdMiddleware = (req, res, next) => {
    const requestId = req.headers['x-request-id'] || uuidv4();
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);
    next();
};
exports.requestIdMiddleware = requestIdMiddleware;
//# sourceMappingURL=request-id.js.map