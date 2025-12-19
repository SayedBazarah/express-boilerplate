"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = void 0;
const api_error_1 = require("../errors/api-error");
const sendSuccess = (res, data, code = api_error_1.HttpCode.OK, meta) => {
    res.status(code).json({
        success: true,
        data,
        ...(meta && { meta }),
    });
};
exports.sendSuccess = sendSuccess;
//# sourceMappingURL=response.js.map