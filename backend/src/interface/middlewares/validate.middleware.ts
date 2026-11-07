import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError, ErrorDetail } from '../../application/errors/app-error.js';

interface ValidationSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

export function validate(schemas: ValidationSchemas) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const details: ErrorDetail[] = [];

    res.locals.validated = res.locals.validated || {};

    if (schemas.body) {
      const result = await schemas.body.safeParseAsync(req.body);
      if (!result.success) {
        formatZodError(result.error, details, 'body');
      } else {
        res.locals.validated.body = result.data;
      }
    }

    if (schemas.params) {
      const result = await schemas.params.safeParseAsync(req.params);
      if (!result.success) {
        formatZodError(result.error, details, 'params');
      } else {
        res.locals.validated.params = result.data;
      }
    }

    if (schemas.query) {
      const result = await schemas.query.safeParseAsync(req.query);
      if (!result.success) {
        formatZodError(result.error, details, 'query');
      } else {
        res.locals.validated.query = result.data;
      }
    }

    if (details.length > 0) {
      next(new ValidationError('Error de validación en la solicitud', details));
      return;
    }

    next();
  };
}

function formatZodError(error: ZodError, details: ErrorDetail[], prefix: string): void {
  for (const issue of error.issues) {
    const fieldPath = issue.path.join('.');
    const field = fieldPath ? `${prefix}.${fieldPath}` : prefix;
    details.push({
      field,
      message: issue.message,
    });
  }
}
