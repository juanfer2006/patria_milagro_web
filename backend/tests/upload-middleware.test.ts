import { describe, it, expect, vi } from 'vitest';
import { MulterError } from 'multer';
import {
  handleMulterError,
  createUploadMiddleware,
} from '../src/interface/middlewares/upload.middleware.js';
import { PayloadTooLargeError, ValidationError } from '../src/application/errors/app-error.js';
import { Request, Response, NextFunction } from 'express';

describe('Upload Middleware Error Translation', () => {
  it('debe traducir LIMIT_FILE_SIZE a PayloadTooLargeError (413)', () => {
    const multerError = new MulterError('LIMIT_FILE_SIZE');
    const result = handleMulterError(multerError);

    expect(result).toBeInstanceOf(PayloadTooLargeError);
    expect((result as PayloadTooLargeError).statusCode).toBe(413);
    expect((result as PayloadTooLargeError).code).toBe('PAYLOAD_TOO_LARGE');
  });

  it('debe traducir LIMIT_UNEXPECTED_FILE a ValidationError (400) con field file', () => {
    const multerError = new MulterError('LIMIT_UNEXPECTED_FILE', 'unexpected');
    const result = handleMulterError(multerError);

    expect(result).toBeInstanceOf(ValidationError);
    expect((result as ValidationError).statusCode).toBe(400);
    expect((result as ValidationError).code).toBe('VALIDATION_ERROR');
    expect((result as ValidationError).details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'file' })]),
    );
  });

  it('debe preservar ValidationError lanzado por fileFilter (tipo no permitido)', () => {
    const validationError = new ValidationError('Tipo de archivo no permitido', [
      { field: 'file', message: 'Solo se aceptan JPEG, PNG y WEBP' },
    ]);
    const result = handleMulterError(validationError);

    expect(result).toBe(validationError);
    expect((result as ValidationError).statusCode).toBe(400);
  });

  it('debe ejecutar el middleware de subida y llamar a next sin error cuando no hay archivo multipart o flujo normal', () => {
    const middleware = createUploadMiddleware();
    const mockReq = {
      headers: {
        'content-type': 'application/json',
      },
    } as unknown as Request;
    const mockRes = {} as Response;
    const nextFn = vi.fn() as NextFunction;

    middleware(mockReq, mockRes, nextFn);
    expect(nextFn).toHaveBeenCalled();
  });
});
