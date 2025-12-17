export const APP_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
  CACHE: {
    DEFAULT_TTL: 3600, // 1 hour
    USER_PREFIX: 'user_cache:',
  },
  SECURITY: {
    SALT_ROUNDS: 12,
  }
} as const;