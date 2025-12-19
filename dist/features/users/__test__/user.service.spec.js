"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jest_mock_extended_1 = require("jest-mock-extended");
const user_service_1 = require("../domain/user.service");
describe('UserService', () => {
    let userService;
    let userRepositoryMock;
    let hashServiceMock;
    let cacheServiceMock;
    let queueServiceMock;
    beforeEach(() => {
        // Create deep mocks for ALL dependencies
        userRepositoryMock = (0, jest_mock_extended_1.mockDeep)();
        hashServiceMock = (0, jest_mock_extended_1.mockDeep)();
        cacheServiceMock = (0, jest_mock_extended_1.mockDeep)();
        queueServiceMock = (0, jest_mock_extended_1.mockDeep)();
        // Inject the real mocks instead of empty objects
        userService = new user_service_1.UserService(userRepositoryMock, hashServiceMock, cacheServiceMock, queueServiceMock);
    });
    it('should hash password and call create on success', async () => {
        // 1. Setup Mocks
        const mockUser = { id: '1', email: 'new@test.com', name: 'John', password: 'hashed_password' };
        userRepositoryMock.findByEmail.mockResolvedValue(null);
        hashServiceMock.hash.mockResolvedValue('hashed_password');
        userRepositoryMock.create.mockResolvedValue(mockUser);
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
        expect(queueServiceMock.addJob).toHaveBeenCalledWith('email-queue', 'send-welcome', expect.objectContaining({ email: 'new@test.com' }));
        expect(result.email).toBe('new@test.com');
    });
});
//# sourceMappingURL=user.service.spec.js.map