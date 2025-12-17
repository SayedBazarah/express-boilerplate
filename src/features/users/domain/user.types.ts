// Why this is better than using Prisma types everywhere:
// 1- Security (The Password Leak): The Prisma User type automatically includes the password field. 
// If you use it in your Controller's return type, you risk accidentally sending hashed passwords to the frontend. 
// UserResponse prevents this.
// 2- Decoupling: If you decide to add a "Calculated Field" (like displayName which combines First and Last name) that doesn't exist in the database, 
// you can add it to your UserResponse type without touching your database schema.
// 3- Job Safety: When your UserService pushes a job to the EmailWorker, 
// the WelcomeEmailJobPayload ensures the worker receives exactly what it needs to render the email template.

import { User } from '@prisma/client';

/**
 * 1. Enums
 * Use enums for fixed sets of values like Roles or Account Status.
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPPORT = 'SUPPORT'
}

/**
 * 2. Request DTOs (Data Transfer Objects)
 * These represent the raw data coming from the client (Express req.body).
 */
export interface RegisterUserDTO extends Pick<User, 'email' | 'password' | 'name'> {}

export interface UpdateUserDTO {
  name?: string;
  isActive?: boolean;
}

/**
 * 3. Response Types
 * We NEVER return the password to the client. This type ensures safety.
 */
export type UserResponse = Omit<User, 'password'>;

/**
 * 4. Service Interfaces
 * Defines what the logic layer returns, often including the clean user object.
 */
export interface AuthResult {
  user: UserResponse;
  token: string;
}

/**
 * 5. Worker Payload Types
 * Specifically for the BullMQ jobs related to this feature.
 */
export interface WelcomeEmailJobPayload {
  userId: string;
  email: string;
  name: string | null;
}