import { Request, Response, NextFunction } from 'express';
import { RegisterUseCase } from '../../application/use-cases/auth/register.use-case.js';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case.js';
import { GetCurrentUserUseCase } from '../../application/use-cases/auth/get-current-user.use-case.js';
import { RegisterBody, LoginBody } from '../../infrastructure/dtos/auth.dto.js';
import { UnauthorizedError } from '../../application/errors/app-error.js';

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = (res.locals.validated?.body as RegisterBody) ?? req.body;
      const result = await this.registerUseCase.execute(body);
      res.status(201).json({
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = (res.locals.validated?.body as LoginBody) ?? req.body;
      const result = await this.loginUseCase.execute(body);
      res.status(200).json({
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const user = await this.getCurrentUserUseCase.execute(req.user.id);
      res.status(200).json({
        data: user,
        user,
      });
    } catch (error) {
      next(error);
    }
  };
}
