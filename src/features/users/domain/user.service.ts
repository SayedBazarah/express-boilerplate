import { Prisma, User } from '@prisma/client';
import { UserRepository } from '../data/user.repository';
import { HashService } from '../../../shared/services/hash.service';
import { CacheService } from '../../../shared/services/cache.service';
import { QueueService } from '../../../shared/services/queue.service';
import { APP_CONSTANTS } from '../../../core/constants';
import { ConflictError, NotFoundError } from '../../../core/errors/api-error';
import { UserResponse } from './user.types';

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService,
    private cacheService: CacheService,
    private queueService: QueueService
  ) {}

  async register(data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
    // 1. Business Rule: Unique Email
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw new ConflictError('Email already registered');

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

  async getProfile(id: string): Promise<UserResponse> {
    const cacheKey = `${APP_CONSTANTS.CACHE.USER_PREFIX}${id}`;
    
    // Use Cache-Aside pattern from Shared CacheService
    return this.cacheService.wrap(cacheKey, APP_CONSTANTS.CACHE.DEFAULT_TTL, () => {
      return this.userRepository.findById(id).then((user: UserResponse | null) => {
        if (!user) throw new NotFoundError('User not found');
        return user;
      });
    });
  }
}