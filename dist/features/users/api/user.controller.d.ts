import { Request, Response } from 'express';
import { UserService } from '../domain/user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    register: (req: Request, res: Response) => Promise<void>;
    getProfile: (req: Request, res: Response) => Promise<void>;
}
