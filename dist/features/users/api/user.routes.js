"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_repository_1 = require("../data/user.repository");
const hash_service_1 = require("../../../shared/services/hash.service");
const cache_service_1 = require("../../../shared/services/cache.service");
const queue_service_1 = require("../../../shared/services/queue.service");
const user_service_1 = require("../domain/user.service");
const validate_request_1 = require("../../../core/middleware/validate-request");
const async_handler_1 = require("../../../core/utils/async-handler");
const user_schema_1 = require("./user.schema");
const router = (0, express_1.Router)();
exports.userRoutes = router;
// 1. Instantiate Dependencies
const userRepository = new user_repository_1.UserRepository();
const hashService = new hash_service_1.HashService();
const cacheService = new cache_service_1.CacheService();
const queueService = new queue_service_1.QueueService();
const userService = new user_service_1.UserService(userRepository, hashService, cacheService, queueService);
const userController = new user_controller_1.UserController(userService);
// 2. Define Routes
router.post('/register', (0, validate_request_1.validateRequest)(user_schema_1.registerSchema), (0, async_handler_1.asyncHandler)(userController.register));
router.get('/:id', (0, async_handler_1.asyncHandler)(userController.getProfile));
//# sourceMappingURL=user.routes.js.map