import { Request, Response, NextFunction } from 'express';
import { ListUsersUseCase } from '../../application/use-cases/users/list-users.use-case.js';
import { DeactivateUserUseCase } from '../../application/use-cases/users/deactivate-user.use-case.js';
import { ListUsersQuery } from '../../infrastructure/dtos/users.dto.js';
import { UnauthorizedError } from '../../application/errors/app-error.js';

export class UsersController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly deactivateUserUseCase: DeactivateUserUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = (res.locals.validated?.query as ListUsersQuery) ?? req.query;
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;

      const result = await this.listUsersUseCase.execute({
        page,
        limit,
        filters: {
          q: query.q,
          role: query.role,
        },
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deactivate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const { id } = req.params;
      await this.deactivateUserUseCase.execute(id as string, req.user);

      // DELETE: 204 sin cuerpo
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
