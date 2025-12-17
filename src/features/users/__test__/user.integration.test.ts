 import request from 'supertest';
import app from '../../../app';
import { prisma } from '../../../config/database';
import { redisClient } from '../../../config/redis';

describe('User Feature Integration', () => {
    // Increase timeout to 30 seconds for all hooks/tests in this block
    jest.setTimeout(30000);
    
    // 1. Setup & Teardown
    beforeAll(async () => {
    // 1. Connect Prisma
    await prisma.$connect();
    
    // 2. Safer Redis Connection
    try {
        // Check if redisClient exists and has the connect method
        if (redisClient && !redisClient.isOpen) {
        await redisClient.connect();
        }
    } catch (err) {
        console.warn('Redis connection failed - ensure Redis is running for integration tests');
    }
    });

  afterAll(async () => {
    // Graceful shutdown is critical to prevent Jest from hanging
    await prisma.$disconnect();
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  });

  // 2. Clear Database State
  beforeEach(async () => {
    // Clear users table. If you have foreign keys, clear child tables first.
    await prisma.user.deleteMany();
  });

  describe('POST /api/v1/users/register', () => {
    const validUser = {
      email: 'test@example.com',
      password: 'SecurePassword123!',
      name: 'Test User'
    };

    it('should successfully register a user and return 201', async () => {
      // Act
      const response = await request(app)
        .post('/api/v1/users/register')
        .send(validUser);

      // Assert: API Response Structure
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          email: validUser.email,
          name: validUser.name
        }
      });

      // Assert: Security (Never return passwords)
      expect(response.body.data).not.toHaveProperty('password');
      expect(response.body.data.id).toBeDefined();

      // Assert: Actual Database Persistence
      const userInDb = await prisma.user.findUnique({
        where: { email: validUser.email }
      });
      expect(userInDb).not.toBeNull();
      expect(userInDb?.email).toBe(validUser.email);
    });

    it('should return 409 Conflict if email is already registered', async () => {
      // Setup: Seed the database with an existing user
      await prisma.user.create({ 
        data: { ...validUser, password: 'hashed_password_example' } 
      });

      // Act
      const response = await request(app)
        .post('/api/v1/users/register')
        .send(validUser);

      // Assert
      expect(response.status).toBe(409);
      expect(response.body.message).toMatch('Email already registered');
    });

    it('should return 400 for invalid input schema', async () => {
      // Act: Send invalid email and short password
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({ email: 'not-an-email', password: '123' });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });
});