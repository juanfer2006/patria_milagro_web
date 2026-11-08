import { Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import {
  PayloadTooLargeError,
  ValidationError,
  AppError,
} from '../../application/errors/app-error.js';

export const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function handleMulterError(err: unknown): Error {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return new PayloadTooLargeError('El archivo excede el tamaño máximo permitido de 5 MB');
    }

    return new ValidationError('Error al procesar el archivo subido', [
      { field: 'file', message: err.message },
    ]);
  }

  if (err instanceof AppError) {
    return err;
  }

  return err instanceof Error ? err : new Error(String(err));
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(
        new ValidationError('Tipo de archivo no permitido. Solo se aceptan JPEG, PNG y WEBP', [
          {
            field: 'file',
            message: 'Tipo de archivo no permitido. Solo se admiten formatos JPEG, PNG y WEBP',
          },
        ]),
      );
    }
  },
}).single('file');

export function createUploadMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    upload(req, res, (err) => {
      if (!err) {
        return next();
      }

      return next(handleMulterError(err));
    });
  };
}
