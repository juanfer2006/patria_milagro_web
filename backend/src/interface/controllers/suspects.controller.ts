import { Request, Response, NextFunction } from 'express';
import {
  CreateSuspectUseCase,
  GetSuspectUseCase,
  UpdateSuspectUseCase,
  DeleteSuspectUseCase,
  ListSuspectsUseCase,
} from '../../application/use-cases/suspects/index.js';
import {
  CreateSuspectBody,
  UpdateSuspectBody,
  ListSuspectsQuery,
} from '../../infrastructure/dtos/suspects.dto.js';
import { SuspectFilters } from '../../domain/repository/index.js';
import { UnauthorizedError } from '../../application/errors/app-error.js';

export class SuspectsController {
  constructor(
    private readonly createSuspectUseCase: CreateSuspectUseCase,
    private readonly getSuspectUseCase: GetSuspectUseCase,
    private readonly updateSuspectUseCase: UpdateSuspectUseCase,
    private readonly deleteSuspectUseCase: DeleteSuspectUseCase,
    private readonly listSuspectsUseCase: ListSuspectsUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const body = (res.locals.validated?.body as CreateSuspectBody) ?? req.body;
      const created = await this.createSuspectUseCase.execute(body, req.user);

      res.status(201).json({ data: created });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const id = req.params.id as string;
      const suspect = await this.getSuspectUseCase.execute(id, req.user);

      res.status(200).json({ data: suspect });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const query = (res.locals.validated?.query as ListSuspectsQuery) ?? req.query;
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;

      const filters: SuspectFilters = {
        caseId: query.caseId,
        status: query.status,
        q: query.q,
      };

      const { items, total } = await this.listSuspectsUseCase.execute(
        filters,
        page,
        limit,
        req.user,
      );

      const totalPages = Math.ceil(total / limit) || 1;

      res.status(200).json({
        data: items,
        pagination: {
          total,
          currentPage: page,
          limit,
          totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const id = req.params.id as string;
      const body = (res.locals.validated?.body as UpdateSuspectBody) ?? req.body;

      const updated = await this.updateSuspectUseCase.execute(id, body, req.user);

      res.status(200).json({ data: updated });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const id = req.params.id as string;
      await this.deleteSuspectUseCase.execute(id, req.user);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
