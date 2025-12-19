"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../../core/constants");
class HashService {
    saltRounds = constants_1.APP_CONSTANTS.SECURITY.SALT_ROUNDS;
    async hash(data) {
        return bcrypt_1.default.hash(data, this.saltRounds);
    }
    async compare(data, encrypted) {
        return bcrypt_1.default.compare(data, encrypted);
    }
}
exports.HashService = HashService;
//# sourceMappingURL=hash.service.js.map