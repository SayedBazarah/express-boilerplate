interface EnvConfig {
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
    REDIS_URL: string;
    CORS_ORIGIN: string;
    LOG_LEVEL: string;
}
export declare const env: EnvConfig;
export {};
