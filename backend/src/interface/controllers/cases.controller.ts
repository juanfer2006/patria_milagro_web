import { Request, Response, NextFunction } from 'express';
import { CreateCaseUseCase } from '../../application/use-cases/cases/create-case.use-case.js';
import { ListCasesUseCase } from '../../application/use-cases/cases/list-cases.use-case.js';
import { GetCaseUseCase } from '../../application/use-cases/cases/get-case.use-case.js';
import { UpdateCaseUseCase } from '../../application/use-cases/cases/update-case.use-case.js';
import { DeleteCaseUseCase } from '../../application/use-cases/cases/delete-case.use-case.js';
import {
  CreateCaseBody,
  UpdateCaseBody,
  ListCasesQuery,
} from '../../infrastructure/dtos/cases.dto.js';
import { UnauthorizedError } from '../../application/errors/app-error.js';

export class CasesController {
  constructor(
    private readonly createCaseUseCase: CreateCaseUseCase,
    private readonly listCasesUseCase: ListCasesUseCase,
    private readonly getCaseUseCase: GetCaseUseCase,
    private readonly updateCaseUseCase: UpdateCaseUseCase,
    private readonly deleteCaseUseCase: DeleteCaseUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const body = (res.locals.validated?.body as CreateCaseBody) ?? req.body;
      const result = await this.createCaseUseCase.execute(body, req.user);

      res.status(201).json({ data: result });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const query = (res.locals.validated?.query as ListCasesQuery) ?? req.query;
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;

      const result = await this.listCasesUseCase.execute(
        {
          page,
          limit,
          filters: {
            q: query.q,
            status: query.status,
            from: query.from,
            to: query.to,
            ownerId: query.ownerId,
          },
        },
        req.user,
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const { id } = req.params;
      const result = await this.getCaseUseCase.execute(id as string, req.user);

      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const { id } = req.params;
      const body = (res.locals.validated?.body as UpdateCaseBody) ?? req.body;
      const result = await this.updateCaseUseCase.execute(id as string, body, req.user);

      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const { id } = req.params;
      await this.deleteCaseUseCase.execute(id as string, req.user);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
