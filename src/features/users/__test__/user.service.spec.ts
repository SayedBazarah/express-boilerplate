import { UserRepository } from '../data/user.repository';
import { HashService } from '../../../shared/services/hash.service';
import { CacheService } from '../../../shared/services/cache.service'; // Ensure imports are correct
import { QueueService } from '../../../shared/services/queue.service';
import { mockDeep, MockProxy } from 'jest-mock-extended';
import { UserService } from '../domain/user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepositoryMock: MockProxy<UserRepository>;
  let hashServiceMock: MockProxy<HashService>;
  let cacheServiceMock: MockProxy<CacheService>;
  let queueServiceMock: MockProxy<QueueService>;

  beforeEach(() => {
    // Create deep mocks for ALL dependencies
    userRepositoryMock = mockDeep<UserRepository>();
    hashServiceMock = mockDeep<HashService>();
    cacheServiceMock = mockDeep<CacheService>();
    queueServiceMock = mockDeep<QueueService>();

    // Inject the real mocks instead of empty objects
    userService = new UserService(
      userRepositoryMock, 
      hashServiceMock, 
      cacheServiceMock, 
      queueServiceMock
    );
  });

  it('should hash password and call create on success', async () => {
    // 1. Setup Mocks
    const mockUser = { id: '1', email: 'new@test.com', name: 'John', password: 'hashed_password' };
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    hashServiceMock.hash.mockResolvedValue('hashed_password');
    userRepositoryMock.create.mockResolvedValue(mockUser as any);
    
    // We don't need to mock resolved value for addJob if it returns void, 
    // but the function must exist. mockDeep handles this automatically.

    // 2. Execute
    const result = await userService.register({ 
      email: 'new@test.com', 
      password: 'password123', 
      name: 'John' 
    });

    // 3. Assert
    expect(hashServiceMock.hash).toHaveBeenCalledWith('password123');
    expect(userRepositoryMock.create).toHaveBeenCalled();
    
    // Verify the queue was actually called with the right data
    expect(queueServiceMock.addJob).toHaveBeenCalledWith(
      'email-queue', 
      'send-welcome', 
      expect.objectContaining({ email: 'new@test.com' })
    );
    
    expect(result.email).toBe('new@test.com');
  });
});