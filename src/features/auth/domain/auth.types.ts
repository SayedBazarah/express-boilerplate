import { User } from '@prisma/client';

export interface RegisterUserDTO extends Pick<User, 'email' | 'password' | 'name'> {}
export interface LoginUserDTO extends Pick<User, 'email' | 'password'> {}

export interface AuthPayload {
  userId: string;
  email: string;
  name: string | null;
}

export interface AuthTokenPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export interface PasswordResetDTO {
  email: string;
}
export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export type AuthResponse = {
  user: Omit<User, 'password'>;
  token: string;
};