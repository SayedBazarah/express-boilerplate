import { SignJWT, jwtVerify } from 'jose';
import { UserRepository } from '../../users/data/user.repository';
import { HashService } from '../../../shared/services/hash.service';
import { CacheService } from '../../../shared/services/cache.service';
import { APP_CONSTANTS } from '../../../core/constants';
import { UnauthorizedError, ForbiddenError } from '../../../core/errors/api-error';
import { env } from '../../../config/env';
import { LoginUserDTO } from './auth.types';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

// Ideally, move secrets to a config service, but keeping here for now is fine
const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);
const JWT_REFRESH_SECRET = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly cacheService: CacheService
  ) {}

  /**
   * Login: Verify credentials and issue tokens
   */
  async login(data: LoginUserDTO) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    // Use Shared HashService (Argon2 under the hood)
    const isValid = await this.hashService.compare(data.password, user.password);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    // 2FA Check (Placeholder for Step 2)
    if (user.isTwoFactorEnabled) {
       // Logic for temp token will go here
       // return { requires2FA: true, tempToken: ... }
    }

// [NEW] 2FA Check
    if (user.isTwoFactorEnabled) {
      // Generate a temporary, short-lived token just for the next verification step
      const tempToken = await new SignJWT({ sub: user.id, purpose: '2fa_login' })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('5m') 
        .sign(JWT_SECRET);

      return { 
        requires2FA: true, 
        tempToken, 
        message: '2FA required. Please verify your code.' 
      };
    }

    return this.generateTokenPair(user.id);
  }

  /**
   * [NEW] Generate Secret & QR Code (Step 1 of enabling 2FA)
   */
  async generate2FA(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedError('User not found');

    const secret = authenticator.generateSecret();
    const appName = process.env.TWO_FACTOR_APP_NAME || 'MyApp';
    
    const otpauth = authenticator.keyuri(user.email, appName, secret);
    const qrCodeUrl = await toDataURL(otpauth);

    // Return secret and QR code to frontend. 
    // We DO NOT save to DB yet. User must verify they scanned it first.
    return { secret, qrCodeUrl };
  }

  /**
   * [NEW] Turn On 2FA (Step 2 of enabling 2FA)
   */
  async turnOn2FA(userId: string, secret: string, code: string) {
    // Verify the code matches the secret the user just scanned
    const isValid = authenticator.verify({ token: code, secret });
    if (!isValid) throw new UnauthorizedError('Invalid 2FA code');

    // Save to DB
    await this.userRepository.update(userId, {
      twoFactorSecret: secret,
      isTwoFactorEnabled: true,
    });
    
    return { message: 'Two-factor authentication enabled successfully' };
  }

  /**
   * [NEW] Verify 2FA to Complete Login
   */
  async verifyLogin2FA(tempToken: string, code: string) {
    // 1. Verify temp token
    const { payload } = await jwtVerify(tempToken, JWT_SECRET);
    if (payload.purpose !== '2fa_login') throw new ForbiddenError('Invalid token purpose');
    
    const userId = payload.sub as string;
    const user = await this.userRepository.findById(userId);

    // 2. Verify TOTP
    if (!user?.twoFactorSecret) throw new ForbiddenError('2FA not set up for this user');
    
    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    if (!isValid) throw new UnauthorizedError('Invalid 2FA code');

    // 3. Issue Real Tokens
    return this.generateTokenPair(userId);
  }

  /**
   * Refresh: Rotate tokens (One-time use refresh tokens)
   */
  async refresh(oldRefreshToken: string) {
    try {
      // 1. Verify structure of the token
      const { payload } = await jwtVerify(oldRefreshToken, JWT_REFRESH_SECRET);
      const userId = payload.sub as string;
      const cacheKey = `${APP_CONSTANTS.CACHE.REFRESH_TOKEN_PREFIX}${userId}`;

      // 2. Check if token exists in Redis (White-list approach)
      const storedToken = await this.cacheService.get<string>(cacheKey);
      
      if (!storedToken || storedToken !== oldRefreshToken) {
        // Security: Token mismatch or reuse attempt
        throw new ForbiddenError('Invalid or expired refresh token');
      }

      // 3. Rotate: Delete old token, issue new pair
      await this.cacheService.delete(cacheKey);
      
      return this.generateTokenPair(userId);
    } catch (error) {
      if (error instanceof ForbiddenError) throw error;
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  /**
   * Logout: simply remove the refresh token
   */
  async logout(userId: string): Promise<void> {
    const cacheKey = `${APP_CONSTANTS.CACHE.REFRESH_TOKEN_PREFIX}${userId}`;
    await this.cacheService.delete(cacheKey);
  }

  /**
   * Helper: Generate Access and Refresh tokens
   * Note: You might want to move these constants to APP_CONSTANTS.AUTH
   */
  private async generateTokenPair(userId: string) {
    const accessToken = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m') // Consider moving to APP_CONSTANTS.AUTH.ACCESS_TOKEN_TTL
      .sign(JWT_SECRET);

    const refreshToken = await new SignJWT({ sub: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // Consider moving to APP_CONSTANTS.AUTH.REFRESH_TOKEN_TTL
      .sign(JWT_REFRESH_SECRET);

    // Store Refresh token in Redis using CacheService
    const cacheKey = `${APP_CONSTANTS.CACHE.REFRESH_TOKEN_PREFIX}${userId}`;
    
    // 7 days in seconds = 604800
    await this.cacheService.set(cacheKey, refreshToken, 7 * 24 * 60 * 60);

    return { accessToken, refreshToken };
  }
}