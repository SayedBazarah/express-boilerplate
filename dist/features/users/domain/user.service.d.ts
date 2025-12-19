import { Prisma, User } from '@prisma/client';
import { UserRepository } from '../data/user.repository';
import { HashService } from '../../../shared/services/hash.service';
import { CacheService } from '../../../shared/services/cache.service';
import { QueueService } from '../../../shared/services/queue.service';
import { UserResponse } from './user.types';
export declare class UserService {
    private userRepository;
    private hashService;
    private cacheService;
    private queueService;
    constructor(userRepository: UserRepository, hashService: HashService, cacheService: CacheService, queueService: QueueService);
    register(data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>>;
    getProfile(id: string): Promise<UserResponse>;
}
