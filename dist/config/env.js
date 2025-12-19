"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const joi_1 = __importDefault(require("joi"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = joi_1.default.object({
    NODE_ENV: joi_1.default.string().valid('development', 'production', 'test').required(),
    PORT: joi_1.default.number().port().default(3000),
    DATABASE_URL: joi_1.default.string().uri().required(),
    REDIS_URL: joi_1.default.string().uri().required(),
    CORS_ORIGIN: joi_1.default.string().required(),
    LOG_LEVEL: joi_1.default.string().valid('error', 'warn', 'info', 'http', 'debug').default('info'),
}).unknown();
const { error, value } = envSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
exports.env = value;
//# sourceMappingURL=env.js.map