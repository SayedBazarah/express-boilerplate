import { Router } from 'express';
import { UserController } from './user.controller';
import { UserRepository } from '../data/user.repository';
import { HashService } from '../../../shared/services/hash.service';
import { CacheService } from '../../../shared/services/cache.service';
import { QueueService } from '../../../shared/services/queue.service';
import { UserService } from '../domain/user.service';
import { validateRequest } from '../../../core/middleware/validate-request';
import { asyncHandler } from '../../../core/utils/async-handler';
import { registerSchema } from './user.schema';

const router = Router();

// 1. Instantiate Dependencies
const userRepository = new UserRepository();
const hashService = new HashService();
const cacheService = new CacheService();
const queueService = new QueueService();

const userService = new UserService(
  userRepository,
  hashService,
  cacheService,
  queueService
);

const userController = new UserController(userService);

// 2. Define Routes
router.post(
  '/register',
  validateRequest(registerSchema),
  asyncHandler(userController.register)
);

router.get(
  '/:id',
  asyncHandler(userController.getProfile)
);

export { router as userRoutes };