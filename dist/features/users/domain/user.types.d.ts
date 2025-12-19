import { User } from '@prisma/client';
/**
 * 1. Enums
 * Use enums for fixed sets of values like Roles or Account Status.
 */
export declare enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
    SUPPORT = "SUPPORT"
}
/**
 * 2. Request DTOs (Data Transfer Objects)
 * These represent the raw data coming from the client (Express req.body).
 */
export interface RegisterUserDTO extends Pick<User, 'email' | 'password' | 'name'> {
}
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
