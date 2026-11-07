import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../domain/services/index.js';
import { Role } from '../../domain/models/index.js';
import { UnauthorizedError, ForbiddenError } from '../../application/errors/app-error.js';

export function createAuthMiddleware(tokenService: ITokenService) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next(new UnauthorizedError('Token de autenticación no proporcionado'));
      return;
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      next(new UnauthorizedError('Token de autenticación no proporcionado'));
      return;
    }

    try {
      const payload = tokenService.verify(token);
      req.user = {
        id: payload.sub,
        role: payload.role,
      };
      next();
    } catch {
      next(new UnauthorizedError('Token de autenticación inválido o expirado'));
    }
  };
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError('Usuario no autenticado'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ForbiddenError('No cuenta con el rol necesario para esta operación'));
      return;
    }

    next();
  };
}
