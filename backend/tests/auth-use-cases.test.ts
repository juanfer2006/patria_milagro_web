import { describe, it, expect, vi } from 'vitest';
import { RegisterUseCase } from '../src/application/use-cases/auth/register.use-case.js';
import { LoginUseCase } from '../src/application/use-cases/auth/login.use-case.js';
import { GetCurrentUserUseCase } from '../src/application/use-cases/auth/get-current-user.use-case.js';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from '../src/application/errors/app-error.js';
import { Role, RecordState, UserEntity } from '../src/domain/models/index.js';
import { IUserRepository } from '../src/domain/repository/index.js';
import { IPasswordHasher, ITokenService } from '../src/domain/services/index.js';

describe('Auth Use Cases', () => {
  const mockUser: UserEntity = {
    id: 'user-uuid-1',
    name: 'Carlos Ruiz',
    email: 'carlos@forense.test',
    passwordHash: 'hashed_secret',
    role: Role.USER,
    state: RecordState.ACTIVE,
    createdAt: new Date('2026-11-01T10:00:00Z'),
    updatedAt: new Date('2026-11-01T10:00:00Z'),
  };

  const mockUserRepo: IUserRepository = {
    create: vi.fn(),
    findByEmail: vi.fn(),
    findById: vi.fn(),
    list: vi.fn(),
    deactivate: vi.fn(),
  };

  const mockHasher: IPasswordHasher = {
    hash: vi.fn().mockResolvedValue('hashed_secret'),
    compare: vi.fn(),
  };

  const mockTokenService: ITokenService = {
    sign: vi.fn().mockReturnValue('mock.jwt.token'),
    verify: vi.fn(),
  };

  describe('RegisterUseCase', () => {
    it('debe registrar un nuevo usuario con rol USER y devolver token y datos sin hash', async () => {
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValueOnce(null);
      vi.mocked(mockUserRepo.create).mockResolvedValueOnce(mockUser);

      const useCase = new RegisterUseCase(mockUserRepo, mockHasher, mockTokenService);
      const result = await useCase.execute({
        name: 'Carlos Ruiz',
        email: 'Carlos@Forense.test', // Debe normalizarse a minúsculas
        password: 'Password123',
      });

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('carlos@forense.test');
      expect(mockUserRepo.create).toHaveBeenCalledWith({
        name: 'Carlos Ruiz',
        email: 'carlos@forense.test',
        passwordHash: 'hashed_secret',
        role: Role.USER,
      });
      expect(result.token).toBe('mock.jwt.token');
      expect(result.user).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: Role.USER,
        createdAt: mockUser.createdAt,
      });
      expect('passwordHash' in (result.user as Record<string, unknown>)).toBe(false);
    });

    it('debe lanzar ConflictError si el correo ya existe (409)', async () => {
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValueOnce(mockUser);

      const useCase = new RegisterUseCase(mockUserRepo, mockHasher, mockTokenService);

      await expect(
        useCase.execute({
          name: 'Otro Usuario',
          email: 'carlos@forense.test',
          password: 'Password123',
        }),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('LoginUseCase', () => {
    it('debe iniciar sesión exitosamente con credenciales válidas', async () => {
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValueOnce(mockUser);
      vi.mocked(mockHasher.compare).mockResolvedValueOnce(true);

      const useCase = new LoginUseCase(mockUserRepo, mockHasher, mockTokenService);
      const result = await useCase.execute({
        email: 'carlos@forense.test',
        password: 'Password123',
      });

      expect(result.token).toBe('mock.jwt.token');
      expect(result.user.email).toBe(mockUser.email);
    });

    it('debe lanzar UnauthorizedError (401) si el correo no existe con mensaje genérico', async () => {
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValueOnce(null);

      const useCase = new LoginUseCase(mockUserRepo, mockHasher, mockTokenService);

      await expect(
        useCase.execute({
          email: 'inexistente@forense.test',
          password: 'Password123',
        }),
      ).rejects.toThrow(UnauthorizedError);
    });

    it('debe lanzar UnauthorizedError (401) si la contraseña es incorrecta con mensaje genérico', async () => {
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValueOnce(mockUser);
      vi.mocked(mockHasher.compare).mockResolvedValueOnce(false);

      const useCase = new LoginUseCase(mockUserRepo, mockHasher, mockTokenService);

      await expect(
        useCase.execute({
          email: 'carlos@forense.test',
          password: 'WrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedError);
    });

    it('debe lanzar UnauthorizedError (401) si el usuario está INACTIVE (Regla 10)', async () => {
      const inactiveUser: UserEntity = {
        ...mockUser,
        state: RecordState.INACTIVE,
      };
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValueOnce(inactiveUser);

      const useCase = new LoginUseCase(mockUserRepo, mockHasher, mockTokenService);

      await expect(
        useCase.execute({
          email: 'carlos@forense.test',
          password: 'Password123',
        }),
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('GetCurrentUserUseCase', () => {
    it('debe retornar el usuario actual público si existe y está activo', async () => {
      vi.mocked(mockUserRepo.findById).mockResolvedValueOnce(mockUser);

      const useCase = new GetCurrentUserUseCase(mockUserRepo);
      const result = await useCase.execute(mockUser.id);

      expect(result.id).toBe(mockUser.id);
      expect('passwordHash' in (result as Record<string, unknown>)).toBe(false);
    });

    it('debe lanzar NotFoundError (404) si el usuario no existe', async () => {
      vi.mocked(mockUserRepo.findById).mockResolvedValueOnce(null);

      const useCase = new GetCurrentUserUseCase(mockUserRepo);

      await expect(useCase.execute('no-existe-id')).rejects.toThrow(NotFoundError);
    });
  });
});
