"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const constants_1 = require("../../../core/constants");
const api_error_1 = require("../../../core/errors/api-error");
class UserService {
    userRepository;
    hashService;
    cacheService;
    queueService;
    constructor(userRepository, hashService, cacheService, queueService) {
        this.userRepository = userRepository;
        this.hashService = hashService;
        this.cacheService = cacheService;
        this.queueService = queueService;
    }
    async register(data) {
        // 1. Business Rule: Unique Email
        const existing = await this.userRepository.findByEmail(data.email);
        if (existing)
            throw new api_error_1.ConflictError('Email already registered');
        // 2. Hash Password
        const hashedPassword = await this.hashService.hash(data.password);
        // 3. Persist
        const user = await this.userRepository.create({
            ...data,
            password: hashedPassword,
        });
        // 4. Background Job: Send Welcome Email
        await this.queueService.addJob('email-queue', 'send-welcome', {
            email: user.email,
            name: user.name,
        });
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async getProfile(id) {
        const cacheKey = `${constants_1.APP_CONSTANTS.CACHE.USER_PREFIX}${id}`;
        // Use Cache-Aside pattern from Shared CacheService
        return this.cacheService.wrap(cacheKey, constants_1.APP_CONSTANTS.CACHE.DEFAULT_TTL, () => {
            return this.userRepository.findById(id).then((user) => {
                if (!user)
                    throw new api_error_1.NotFoundError('User not found');
                return user;
            });
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map