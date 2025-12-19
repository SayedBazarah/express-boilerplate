import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from '../domain/auth.service';
import { UserRepository } from '../../users/data/user.repository';
import { HashService } from '../../../shared/services/hash.service';
import { CacheService } from '../../../shared/services/cache.service';
import { validateRequest } from '../../../core/middleware/validate-request';
import { asyncHandler } from '../../../core/utils/async-handler';
import { loginSchema, refreshTokenSchema } from './auth.schema';

const router = Router();

// 1. Instantiate Dependencies
const userRepository = new UserRepository();
const hashService = new HashService();
const cacheService = new CacheService();

// 2. Inject Dependencies into Service
const authService = new AuthService(
  userRepository,
  hashService,
  cacheService
);

// 3. Inject Service into Controller
const authController = new AuthController(authService);

// 4. Define Routes
router.post(
  '/login',
  validateRequest(loginSchema),
  asyncHandler(authController.login)
);

router.post(
  '/refresh',
  validateRequest(refreshTokenSchema), // Added validation here for consistency
  asyncHandler(authController.refresh)
);

// Commented out until Step 3 (Auth Middleware) is ready
// router.post(
//   '/logout', 
//   authenticate, 
//   asyncHandler(authController.logout)
// );

export { router as authRoutes };