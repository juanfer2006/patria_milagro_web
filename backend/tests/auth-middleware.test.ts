import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAuthMiddleware, requireRole } from '../src/interface/middlewares/auth.middleware.js';
import { ITokenService } from '../src/domain/services/index.js';
import { Role } from '../src/domain/models/index.js';
import { UnauthorizedError, ForbiddenError } from '../src/application/errors/app-error.js';
import { Request, Response, NextFunction } from 'express';

describe('Auth Middleware and requireRole', () => {
  let mockTokenService: ITokenService;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFn: NextFunction;

  beforeEach(() => {
    mockTokenService = {
      sign: vi.fn(),
      verify: vi.fn(),
    };
    mockReq = {
      headers: {},
    };
    mockRes = {};
    nextFn = vi.fn();
  });

  describe('authMiddleware', () => {
    it('debe pasar error UnauthorizedError (401) si falta header Authorization', () => {
      const middleware = createAuthMiddleware(mockTokenService);
      middleware(mockReq as Request, mockRes as Response, nextFn);

      expect(nextFn).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('debe pasar error UnauthorizedError (401) si el header no comienza con Bearer', () => {
      mockReq.headers = { authorization: 'Basic 123456' };
      const middleware = createAuthMiddleware(mockTokenService);
      middleware(mockReq as Request, mockRes as Response, nextFn);

      expect(nextFn).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('debe pasar error UnauthorizedError (401) si el token es inválido o expirado', () => {
      mockReq.headers = { authorization: 'Bearer token-invalido' };
      vi.mocked(mockTokenService.verify).mockImplementationOnce(() => {
        throw new Error('Token expirado');
      });

      const middleware = createAuthMiddleware(mockTokenService);
      middleware(mockReq as Request, mockRes as Response, nextFn);

      expect(nextFn).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('debe asignar req.user y llamar a next() sin errores si el token es válido', () => {
      mockReq.headers = { authorization: 'Bearer token-valido' };
      vi.mocked(mockTokenService.verify).mockReturnValueOnce({
        sub: 'user-id-99',
        role: Role.USER,
      });

      const middleware = createAuthMiddleware(mockTokenService);
      middleware(mockReq as Request, mockRes as Response, nextFn);

      expect(mockReq.user).toEqual({
        id: 'user-id-99',
        role: Role.USER,
      });
      expect(nextFn).toHaveBeenCalledWith();
    });
  });

  describe('requireRole', () => {
    it('debe lanzar UnauthorizedError si req.user no existe', () => {
      mockReq.user = undefined;
      const middleware = requireRole(Role.ADMIN);
      middleware(mockReq as Request, mockRes as Response, nextFn);

      expect(nextFn).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('debe lanzar ForbiddenError (403) si el rol no coincide', () => {
      mockReq.user = { id: 'u1', role: Role.USER };
      const middleware = requireRole(Role.ADMIN);
      middleware(mockReq as Request, mockRes as Response, nextFn);

      expect(nextFn).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it('debe llamar a next() si el rol del usuario está permitido', () => {
      mockReq.user = { id: 'a1', role: Role.ADMIN };
      const middleware = requireRole(Role.ADMIN);
      middleware(mockReq as Request, mockRes as Response, nextFn);

      expect(nextFn).toHaveBeenCalledWith();
    });
  });
});
