"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../config/logger");
// Silence logger during tests
logger_1.logger.silent = true;
jest.mock('uuid', () => ({
    v4: () => 'test-uuid-123456',
}));
// Mock Redis globally as most tests won't need a real connection
jest.mock('../config/redis', () => ({
    redisClient: {
        get: jest.fn(),
        setEx: jest.fn(),
        del: jest.fn(),
        connect: jest.fn(),
        on: jest.fn(),
    },
}));
//# sourceMappingURL=setup.js.map