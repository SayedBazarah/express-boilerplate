import { Request, Response } from 'express';
import { AuthService } from '../domain/auth.service';
import { loginSchema, refreshTokenSchema, verifyLogin2faSchema } from './auth.schema';
import { sendSuccess } from '../../../core/utils/response';
import { HttpCode } from '../../../core/errors/api-error';
export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    // Validate request body (Consistent with refresh logic)
    const value = await loginSchema.validateAsync(req.body);

    const result = await this.authService.login(value);
    sendSuccess(res, result, HttpCode.OK);
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    // Validate request body
    const value = await refreshTokenSchema.validateAsync(req.body);

    const result = await this.authService.refresh(value.refreshToken);
    sendSuccess(res, result, HttpCode.OK);
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    // Ideally, extend the Express Request type globally to include 'user'
    // For now, casting to 'any' allows access to the property attached by middleware
    const userId = req.user?.id as string;

    if (userId) {
      await this.authService.logout(userId);
    }

    sendSuccess(res, null, HttpCode.OK);
  };

  // [NEW] Generate QR Code
  generate2FA = async (req: Request, res: Response): Promise<void> => {
    // req.user will be populated by the 'authenticate' middleware later
    const userId = req.user?.id as string;
    const result = await this.authService.generate2FA(userId);
    sendSuccess(res, result, HttpCode.OK);
  };

  // [NEW] Enable 2FA
  turnOn2FA = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id as string;
    // We expect { secret, token } in body. Ideally add a Joi schema for this too.
    const { secret, token } = req.body;

    const result = await this.authService.turnOn2FA(userId, secret, token);
    sendSuccess(res, result, HttpCode.OK);
  };

  // [NEW] Finalize Login
  verifyLogin2FA = async (req: Request, res: Response): Promise<void> => {
    const value = await verifyLogin2faSchema.validateAsync(req.body);
    const result = await this.authService.verifyLogin2FA(value.tempToken, value.code);
    sendSuccess(res, result, HttpCode.OK);
  };
}
