import { describe, it, expect, vi } from 'vitest';
import { ListUsersUseCase } from '../src/application/use-cases/users/list-users.use-case.js';
import { DeactivateUserUseCase } from '../src/application/use-cases/users/deactivate-user.use-case.js';
import { ConflictError, NotFoundError } from '../src/application/errors/app-error.js';
import { Role, RecordState, UserEntity, Actor } from '../src/domain/models/index.js';
import { IUserRepository } from '../src/domain/repository/index.js';

describe('Users Use Cases (Solo ADMIN)', () => {
  const mockAdminActor: Actor = {
    id: 'admin-1',
    role: Role.ADMIN,
  };

  const mockUserEntity: UserEntity = {
    id: 'user-to-deactivate',
    name: 'Usuario Prueba',
    email: 'prueba@forense.test',
    passwordHash: 'hash',
    role: Role.USER,
    state: RecordState.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserRepo: IUserRepository = {
    create: vi.fn(),
    findByEmail: vi.fn(),
    findById: vi.fn(),
    list: vi.fn(),
    deactivate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ListUsersUseCase', () => {
    it('debe listar usuarios de forma paginada y sin exponer passwordHash', async () => {
      vi.mocked(mockUserRepo.list).mockResolvedValueOnce({
        items: [mockUserEntity],
        total: 1,
      });

      const useCase = new ListUsersUseCase(mockUserRepo);
      const result = await useCase.execute({
        page: 1,
        limit: 10,
        filters: {},
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.id).toBe(mockUserEntity.id);
      expect('passwordHash' in (result.data[0] as Record<string, unknown>)).toBe(false);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.currentPage).toBe(1);
    });
  });

  describe('DeactivateUserUseCase', () => {
    it('debe desactivar un usuario cuando el admin es diferente al objetivo', async () => {
      vi.mocked(mockUserRepo.findById).mockResolvedValueOnce(mockUserEntity);
      vi.mocked(mockUserRepo.deactivate).mockResolvedValueOnce();

      const useCase = new DeactivateUserUseCase(mockUserRepo);
      await useCase.execute('user-to-deactivate', mockAdminActor);

      expect(mockUserRepo.deactivate).toHaveBeenCalledWith('user-to-deactivate');
    });

    it('debe lanzar ConflictError (409) si el admin intenta desactivarse a sí mismo (Regla 9)', async () => {
      const useCase = new DeactivateUserUseCase(mockUserRepo);

      await expect(useCase.execute('admin-1', mockAdminActor)).rejects.toThrow(ConflictError);
      expect(mockUserRepo.deactivate).not.toHaveBeenCalled();
    });

    it('debe lanzar NotFoundError (404) si el usuario a desactivar no existe', async () => {
      vi.mocked(mockUserRepo.findById).mockResolvedValueOnce(null);

      const useCase = new DeactivateUserUseCase(mockUserRepo);

      await expect(useCase.execute('user-inexistente', mockAdminActor)).rejects.toThrow(
        NotFoundError,
      );
    });
  });
});
