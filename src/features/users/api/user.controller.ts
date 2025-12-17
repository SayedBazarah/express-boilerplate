import { Request, Response } from 'express';
import { sendSuccess } from '../../../core/utils/response';
import { HttpCode } from '../../../core/errors/api-error';
import { UserService } from '../domain/user.service';

export class UserController {
  constructor(private userService: UserService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.register(req.body);
    sendSuccess(res, user, HttpCode.CREATED);
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.getProfile(req.params.id);
    sendSuccess(res, user);
  };
}