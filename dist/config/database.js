"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const env_1 = require("./env");
const logger_1 = require("./logger");
const pool = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL,
    // Cloud proxies like db.prisma.io need more time to respond
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 30000,
    // CRITICAL: Remote proxies REQUIRE SSL
    ssl: {
        rejectUnauthorized: false // Allows connection to the Prisma proxy certificate
    }
});
pool.on('error', (err) => {
    logger_1.logger.error('Unexpected error on idle PostgreSQL client', err);
});
const adapter = new adapter_pg_1.PrismaPg(pool);
exports.prisma = new client_1.PrismaClient({ adapter });
const connectDatabase = async () => {
    try {
        const client = await pool.connect();
        logger_1.logger.info('✅ Connected to Prisma Cloud Database');
        client.release();
    }
    catch (error) {
        logger_1.logger.error('❌ Failed to connect to Prisma Cloud DB. Check if your internet is stable.');
        logger_1.logger.error(error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=database.js.map