"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jest_mock_extended_1 = require("jest-mock-extended");
/**
 * 1. Define the mock instance.
 * IMPORTANT: The variable name MUST start with 'mock' (e.g., mockPrisma)
 * so Jest allows it to be used inside the hoisted jest.mock() block.
 */
const mockPrisma = (0, jest_mock_extended_1.mockDeep)();
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
const user_repository_1 = require("../data/user.repository");
describe('UserRepository', () => {
    let repo;
    beforeEach(() => {
        repo = new user_repository_1.UserRepository();
        // Clear mock history between tests so call counts don't leak
        jest.clearAllMocks();
    });
    describe('findByEmail', () => {
        it('should call prisma.user.findUnique with the correct arguments', async () => {
            // Arrange: Setup what the mock should return
            const mockUser = { id: '1', email: 'test@test.com', name: 'Test User' };
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
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
//# sourceMappingURL=user.repository.spec.js.map