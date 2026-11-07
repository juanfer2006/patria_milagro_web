import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../application/errors/app-error.js';
import { logger } from '../../infrastructure/services/logger.service.js';

interface PrismaClientKnownRequestErrorLike {
  code: string;
  meta?: Record<string, unknown>;
  message: string;
}

function isPrismaError(error: unknown): error is PrismaClientKnownRequestErrorLike {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string' &&
    (error as { code: string }).code.startsWith('P')
  );
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // Manejo de errores de la aplicación
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  // Manejo de errores conocidos de Prisma
  if (isPrismaError(err)) {
    if (err.code === 'P2002') {
      res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'Existe un conflicto con un valor único ya registrado',
        },
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'El registro solicitado no fue encontrado',
        },
      });
      return;
    }

    if (err.code === 'P2003') {
      res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'Violación de restricción de clave foránea o relación',
        },
      });
      return;
    }

    logger.error('Error de Prisma no controlado', { code: err.code, message: err.message });
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno en el servidor de base de datos',
      },
    });
    return;
  }

  // Error genérico no controlado (500) sin stack trace
  const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
  logger.error('Error no controlado en la aplicación', { message: errorMessage });

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Ha ocurrido un error interno en el servidor',
    },
  });
}
