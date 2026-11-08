import { Request, Response, NextFunction } from 'express';
import { UploadImageUseCase } from '../../application/use-cases/uploads/upload-image.use-case.js';
import { UploadBody } from '../../infrastructure/dtos/uploads.dto.js';
import { UnauthorizedError } from '../../application/errors/app-error.js';

export class UploadsController {
  constructor(private readonly uploadImageUseCase: UploadImageUseCase) {}

  upload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const body = (res.locals.validated?.body as UploadBody) ?? req.body;
      const folder = body?.folder ?? 'cases';

      const result = await this.uploadImageUseCase.execute({
        file: req.file,
        folder,
      });

      res.status(201).json({ data: result });
    } catch (error) {
      next(error);
    }
  };
}
