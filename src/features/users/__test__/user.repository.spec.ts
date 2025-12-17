import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

/**
 * 1. Define the mock instance. 
 * IMPORTANT: The variable name MUST start with 'mock' (e.g., mockPrisma) 
 * so Jest allows it to be used inside the hoisted jest.mock() block.
 */
const mockPrisma = mockDeep<PrismaClient>();

/**
 * 2. Mock the module.
 * This ensures that whenever 'user.repository' imports 'prisma', 
 * it receives our mocked version instead of the real one.
 */
jest.mock('../../../config/database', () => ({
  __esModule: true, // Ensures compatibility with ES Modules
  prisma: mockPrisma,
}));

// 3. Import the repo AFTER the mock is established
import { UserRepository } from '../data/user.repository';

describe('UserRepository', () => {
  let repo: UserRepository;

  beforeEach(() => {
    repo = new UserRepository();
    
    // Clear mock history between tests so call counts don't leak
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should call prisma.user.findUnique with the correct arguments', async () => {
      // Arrange: Setup what the mock should return
      const mockUser = { id: '1', email: 'test@test.com', name: 'Test User' };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);

      // Act: Call the method we are testing
      const result = await repo.findByEmail('test@test.com');

      // Assert: Verify the interaction with Prisma
      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' }
      });
      
      // Assert: Verify the returned data
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user is found', async () => {
      // Arrange
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await repo.findByEmail('unknown@test.com');

      // Assert
      expect(result).toBeNull();
    });
  });
});