import { Request, Response, NextFunction } from 'express';
import {
  CreateEvidenceUseCase,
  ListEvidencesUseCase,
  GetEvidenceUseCase,
  UpdateEvidenceUseCase,
  DeleteEvidenceUseCase,
} from '../../application/use-cases/evidences/index.js';
import {
  CreateEvidenceBody,
  UpdateEvidenceBody,
  ListEvidencesQuery,
} from '../../infrastructure/dtos/evidences.dto.js';
import { UnauthorizedError } from '../../application/errors/app-error.js';

export class EvidencesController {
  constructor(
    private readonly createEvidenceUseCase: CreateEvidenceUseCase,
    private readonly listEvidencesUseCase: ListEvidencesUseCase,
    private readonly getEvidenceUseCase: GetEvidenceUseCase,
    private readonly updateEvidenceUseCase: UpdateEvidenceUseCase,
    private readonly deleteEvidenceUseCase: DeleteEvidenceUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const body = (res.locals.validated?.body as CreateEvidenceBody) ?? req.body;
      const result = await this.createEvidenceUseCase.execute(body, req.user);

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

      const query = (res.locals.validated?.query as ListEvidencesQuery) ?? req.query;
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;

      const result = await this.listEvidencesUseCase.execute(
        {
          page,
          limit,
          filters: {
            caseId: query.caseId,
            suspectId: query.suspectId,
            type: query.type,
            q: query.q,
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
      const result = await this.getEvidenceUseCase.execute(id as string, req.user);

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
      const body = (res.locals.validated?.body as UpdateEvidenceBody) ?? req.body;
      const result = await this.updateEvidenceUseCase.execute(id as string, body, req.user);

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
      await this.deleteEvidenceUseCase.execute(id as string, req.user);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
