import { logger } from '../config/logger';

// Silence logger during tests
logger.silent = true;

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