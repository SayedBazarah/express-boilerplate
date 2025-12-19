"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const response_1 = require("../../../core/utils/response");
const api_error_1 = require("../../../core/errors/api-error");
class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    register = async (req, res) => {
        const user = await this.userService.register(req.body);
        (0, response_1.sendSuccess)(res, user, api_error_1.HttpCode.CREATED);
    };
    getProfile = async (req, res) => {
        const user = await this.userService.getProfile(req.params.id);
        (0, response_1.sendSuccess)(res, user);
    };
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map