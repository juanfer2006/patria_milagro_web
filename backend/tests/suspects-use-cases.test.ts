import { describe, it, expect, beforeEach } from 'vitest';
import {
  CreateSuspectUseCase,
  GetSuspectUseCase,
  UpdateSuspectUseCase,
  DeleteSuspectUseCase,
  ListSuspectsUseCase,
} from '../src/application/use-cases/suspects/index.js';
import {
  ISuspectRepository,
  ICaseRepository,
  CreateSuspectData,
  UpdateSuspectData,
  SuspectFilters,
} from '../src/domain/repository/index.js';
import {
  SuspectEntity,
  CaseEntity,
  Actor,
  Role,
  CaseStatus,
  SuspectStatus,
  RecordState,
} from '../src/domain/models/index.js';
import { NotFoundError, ConflictError } from '../src/application/errors/app-error.js';

class MockSuspectRepository implements ISuspectRepository {
  public items: SuspectEntity[] = [];
  public unlinkedEvidencesCount = 0;

  async create(data: CreateSuspectData): Promise<SuspectEntity> {
    const entity: SuspectEntity = {
      id: `suspect-${Date.now()}-${Math.random()}`,
      fullName: data.fullName,
      alias: data.alias ?? null,
      description: data.description ?? null,
      suspicionLevel: data.suspicionLevel ?? 0,
      status: data.status ?? SuspectStatus.PERSON_OF_INTEREST,
      photoUrl: data.photoUrl ?? null,
      state: RecordState.ACTIVE,
      caseId: data.caseId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.push(entity);
    return entity;
  }

  async findById(id: string): Promise<SuspectEntity | null> {
    const found = this.items.find((item) => item.id === id && item.state === RecordState.ACTIVE);
    return found ? { ...found } : null;
  }

  async list(
    filters: SuspectFilters,
    page: number,
    limit: number,
  ): Promise<{ items: SuspectEntity[]; total: number }> {
    let filtered = this.items.filter((item) => item.state === RecordState.ACTIVE);

    if (filters.caseId) {
      filtered = filtered.filter((item) => item.caseId === filters.caseId);
    }
    if (filters.status) {
      filtered = filtered.filter((item) => item.status === filters.status);
    }
    if (filters.q) {
      const qLower = filters.q.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.fullName.toLowerCase().includes(qLower) ||
          (item.alias && item.alias.toLowerCase().includes(qLower)),
      );
    }

    const total = filtered.length;
    const skip = (page - 1) * limit;
    const paginated = filtered.slice(skip, skip + limit);

    return { items: paginated, total };
  }

  async update(id: string, data: UpdateSuspectData): Promise<SuspectEntity> {
    const idx = this.items.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error('Not found');

    const current = this.items[idx];
    const updated: SuspectEntity = {
      ...current,
      ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
      ...(data.alias !== undefined ? { alias: data.alias } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.suspicionLevel !== undefined ? { suspicionLevel: data.suspicionLevel } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.photoUrl !== undefined ? { photoUrl: data.photoUrl } : {}),
      updatedAt: new Date(),
    };

    this.items[idx] = updated;
    return updated;
  }

  async deactivateAndUnlinkEvidences(id: string): Promise<void> {
    const item = this.items.find((s) => s.id === id);
    if (item) {
      item.state = RecordState.INACTIVE;
      this.unlinkedEvidencesCount++;
    }
  }
}

class MockCaseRepository implements Partial<ICaseRepository> {
  public cases: CaseEntity[] = [];

  async findById(id: string): Promise<CaseEntity | null> {
    const found = this.cases.find((c) => c.id === id && c.state === RecordState.ACTIVE);
    return found ? { ...found } : null;
  }
}

describe('Suspects Use Cases', () => {
  let suspectRepo: MockSuspectRepository;
  let caseRepo: MockCaseRepository;

  const actorUser: Actor = { id: 'user-1', role: Role.USER };
  const actorOtherUser: Actor = { id: 'user-2', role: Role.USER };
  const actorAdmin: Actor = { id: 'admin-1', role: Role.ADMIN };

  const testCase: CaseEntity = {
    id: 'case-100',
    caseNumber: 1,
    title: 'Robo a banco central',
    description: 'Investigación en curso',
    location: 'Medellín',
    incidentDate: new Date(),
    status: CaseStatus.OPEN,
    imageUrl: null,
    ownerId: 'user-1',
    state: RecordState.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const closedCase: CaseEntity = {
    ...testCase,
    id: 'case-closed',
    status: CaseStatus.CLOSED,
  };

  beforeEach(() => {
    suspectRepo = new MockSuspectRepository();
    caseRepo = new MockCaseRepository();
    caseRepo.cases = [testCase, closedCase];
  });

  describe('CreateSuspectUseCase', () => {
    it('debe crear un sospechoso exitosamente cuando el caso pertenece al usuario', async () => {
      const useCase = new CreateSuspectUseCase(suspectRepo, caseRepo as ICaseRepository);

      const result = await useCase.execute(
        {
          caseId: 'case-100',
          fullName: 'Armando Casas',
          alias: 'El Muro',
          suspicionLevel: 50,
          status: SuspectStatus.PERSON_OF_INTEREST,
        },
        actorUser,
      );

      expect(result.id).toBeDefined();
      expect(result.fullName).toBe('Armando Casas');
      expect(result.caseId).toBe('case-100');
      expect(suspectRepo.items).toHaveLength(1);
    });

    it('debe permitir crear sospechoso a un ADMIN en cualquier caso', async () => {
      const useCase = new CreateSuspectUseCase(suspectRepo, caseRepo as ICaseRepository);

      const result = await useCase.execute(
        {
          caseId: 'case-100',
          fullName: 'Mario Silva',
        },
        actorAdmin,
      );

      expect(result.fullName).toBe('Mario Silva');
    });

    it('debe lanzar NotFoundError (404) si el caso no existe o pertenece a otro usuario', async () => {
      const useCase = new CreateSuspectUseCase(suspectRepo, caseRepo as ICaseRepository);

      await expect(
        useCase.execute(
          {
            caseId: 'case-inexistente',
            fullName: 'Armando Casas',
          },
          actorUser,
        ),
      ).rejects.toThrow(NotFoundError);

      await expect(
        useCase.execute(
          {
            caseId: 'case-100',
            fullName: 'Armando Casas',
          },
          actorOtherUser,
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it('debe lanzar ConflictError (409) si el caso está CLOSED (Regla 3)', async () => {
      const useCase = new CreateSuspectUseCase(suspectRepo, caseRepo as ICaseRepository);

      await expect(
        useCase.execute(
          {
            caseId: 'case-closed',
            fullName: 'Sospechoso Tardio',
          },
          actorUser,
        ),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('GetSuspectUseCase', () => {
    it('debe consultar un sospechoso activo perteneciente al caso del usuario', async () => {
      const suspect = await suspectRepo.create({
        caseId: 'case-100',
        fullName: 'Carlos Ruiz',
      });

      const useCase = new GetSuspectUseCase(suspectRepo, caseRepo as ICaseRepository);
      const result = await useCase.execute(suspect.id, actorUser);

      expect(result.id).toBe(suspect.id);
      expect(result.fullName).toBe('Carlos Ruiz');
    });

    it('debe lanzar 404 si el sospechoso no existe o está inactivo (Regla 8)', async () => {
      const suspect = await suspectRepo.create({
        caseId: 'case-100',
        fullName: 'Inactivo Ruiz',
      });
      suspect.state = RecordState.INACTIVE;

      const useCase = new GetSuspectUseCase(suspectRepo, caseRepo as ICaseRepository);
      await expect(useCase.execute(suspect.id, actorUser)).rejects.toThrow(NotFoundError);
    });

    it('debe lanzar 404 si el usuario intenta acceder al sospechoso de un caso ajeno', async () => {
      const suspect = await suspectRepo.create({
        caseId: 'case-100',
        fullName: 'Carlos Ruiz',
      });

      const useCase = new GetSuspectUseCase(suspectRepo, caseRepo as ICaseRepository);
      await expect(useCase.execute(suspect.id, actorOtherUser)).rejects.toThrow(NotFoundError);
    });
  });

  describe('UpdateSuspectUseCase', () => {
    it('debe actualizar los datos de un sospechoso correctamente', async () => {
      const suspect = await suspectRepo.create({
        caseId: 'case-100',
        fullName: 'Original Name',
        suspicionLevel: 20,
      });

      const useCase = new UpdateSuspectUseCase(suspectRepo, caseRepo as ICaseRepository);
      const updated = await useCase.execute(
        suspect.id,
        {
          fullName: 'Updated Name',
          suspicionLevel: 85,
          status: SuspectStatus.DETAINED,
        },
        actorUser,
      );

      expect(updated.fullName).toBe('Updated Name');
      expect(updated.suspicionLevel).toBe(85);
      expect(updated.status).toBe(SuspectStatus.DETAINED);
    });

    it('debe permitir actualizar un sospechoso aun si el caso está CLOSED', async () => {
      const suspect = await suspectRepo.create({
        caseId: 'case-closed',
        fullName: 'Sospechoso Caso Cerrado',
      });

      const useCase = new UpdateSuspectUseCase(suspectRepo, caseRepo as ICaseRepository);
      const updated = await useCase.execute(
        suspect.id,
        {
          alias: 'Alias Actualizado',
        },
        actorUser,
      );

      expect(updated.alias).toBe('Alias Actualizado');
    });
  });

  describe('DeleteSuspectUseCase', () => {
    it('debe desactivar el sospechoso y desvincular sus evidencias (Regla 7)', async () => {
      const suspect = await suspectRepo.create({
        caseId: 'case-100',
        fullName: 'Para Eliminar',
      });

      const useCase = new DeleteSuspectUseCase(suspectRepo, caseRepo as ICaseRepository);
      await useCase.execute(suspect.id, actorUser);

      const found = await suspectRepo.findById(suspect.id);
      expect(found).toBeNull();
      expect(suspectRepo.unlinkedEvidencesCount).toBe(1);
    });
  });

  describe('ListSuspectsUseCase', () => {
    beforeEach(async () => {
      await suspectRepo.create({
        caseId: 'case-100',
        fullName: 'Juan Lopez',
        alias: 'El Rápido',
        status: SuspectStatus.PERSON_OF_INTEREST,
      });
      await suspectRepo.create({
        caseId: 'case-100',
        fullName: 'Pedro Gomez',
        alias: 'El Lento',
        status: SuspectStatus.DETAINED,
      });
    });

    it('debe listar sospechosos con paginación', async () => {
      const useCase = new ListSuspectsUseCase(suspectRepo, caseRepo as ICaseRepository);
      const result = await useCase.execute({ caseId: 'case-100' }, 1, 10, actorUser);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('debe filtrar sospechosos por búsqueda q (nombre o alias)', async () => {
      const useCase = new ListSuspectsUseCase(suspectRepo, caseRepo as ICaseRepository);
      const result = await useCase.execute({ caseId: 'case-100', q: 'Rápido' }, 1, 10, actorUser);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].fullName).toBe('Juan Lopez');
    });

    it('debe filtrar sospechosos por status', async () => {
      const useCase = new ListSuspectsUseCase(suspectRepo, caseRepo as ICaseRepository);
      const result = await useCase.execute(
        { caseId: 'case-100', status: SuspectStatus.DETAINED },
        1,
        10,
        actorUser,
      );

      expect(result.items).toHaveLength(1);
      expect(result.items[0].fullName).toBe('Pedro Gomez');
    });
  });
});
