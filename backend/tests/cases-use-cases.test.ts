import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateCaseUseCase } from '../src/application/use-cases/cases/create-case.use-case.js';
import { ListCasesUseCase } from '../src/application/use-cases/cases/list-cases.use-case.js';
import { GetCaseUseCase } from '../src/application/use-cases/cases/get-case.use-case.js';
import { UpdateCaseUseCase } from '../src/application/use-cases/cases/update-case.use-case.js';
import { DeleteCaseUseCase } from '../src/application/use-cases/cases/delete-case.use-case.js';
import { NotFoundError } from '../src/application/errors/app-error.js';
import { Role, RecordState, CaseStatus, CaseEntity, Actor } from '../src/domain/models/index.js';
import { ICaseRepository, CreateCaseData, UpdateCaseData } from '../src/domain/repository/index.js';

describe('Cases Use Cases', () => {
  const userActor: Actor = {
    id: 'user-uuid-1',
    role: Role.USER,
  };

  const otherUserActor: Actor = {
    id: 'user-uuid-2',
    role: Role.USER,
  };

  const adminActor: Actor = {
    id: 'admin-uuid-1',
    role: Role.ADMIN,
  };

  const sampleCaseEntity: CaseEntity = {
    id: 'case-uuid-100',
    caseNumber: 1,
    title: 'Homicidio en el callejón 45',
    description: 'Investigación preliminar de los hechos ocurridos a la medianoche.',
    location: 'Sector Centro, Calle 45',
    incidentDate: new Date('2026-11-01T22:00:00Z'),
    status: CaseStatus.OPEN,
    imageUrl: 'https://example.com/cases/case1.jpg',
    state: RecordState.ACTIVE,
    ownerId: 'user-uuid-1',
    createdAt: new Date('2026-11-02T10:00:00Z'),
    updatedAt: new Date('2026-11-02T10:00:00Z'),
  };

  const mockCaseRepo: ICaseRepository = {
    create: vi.fn(),
    findById: vi.fn(),
    list: vi.fn(),
    update: vi.fn(),
    deactivateCascade: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CreateCaseUseCase', () => {
    it('debe asignar ownerId del actor y status OPEN por defecto', async () => {
      vi.mocked(mockCaseRepo.create).mockImplementation(async (data: CreateCaseData) => ({
        id: 'new-id',
        caseNumber: 2,
        title: data.title,
        description: data.description,
        location: data.location,
        incidentDate: data.incidentDate,
        status: data.status ?? CaseStatus.OPEN,
        imageUrl: data.imageUrl ?? null,
        state: RecordState.ACTIVE,
        ownerId: data.ownerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const useCase = new CreateCaseUseCase(mockCaseRepo);
      const result = await useCase.execute(
        {
          title: 'Robo a banco central',
          description: 'Sustracción de fondos durante el fin de semana.',
          location: 'Avenida Principal #12',
          incidentDate: new Date('2026-11-05T08:00:00Z'),
        },
        userActor,
      );

      expect(mockCaseRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ownerId: userActor.id,
          status: CaseStatus.OPEN,
        }),
      );
      expect(result.ownerId).toBe(userActor.id);
      expect(result.status).toBe(CaseStatus.OPEN);
      expect('state' in (result as Record<string, unknown>)).toBe(false);
    });
  });

  describe('ListCasesUseCase', () => {
    it('debe forzar ownerId al ID del actor cuando el rol es USER e ignorar ownerId del query', async () => {
      vi.mocked(mockCaseRepo.list).mockResolvedValueOnce({
        items: [sampleCaseEntity],
        total: 1,
      });

      const useCase = new ListCasesUseCase(mockCaseRepo);
      const result = await useCase.execute(
        {
          page: 1,
          limit: 10,
          filters: {
            ownerId: 'otro-owner-id-malicioso',
            status: CaseStatus.OPEN,
          },
        },
        userActor,
      );

      expect(mockCaseRepo.list).toHaveBeenCalledWith(
        expect.objectContaining({
          ownerId: userActor.id,
          status: CaseStatus.OPEN,
        }),
        1,
        10,
      );
      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.id).toBe(sampleCaseEntity.id);
      expect('state' in (result.data[0] as Record<string, unknown>)).toBe(false);
    });

    it('debe permitir a un ADMIN filtrar por ownerId o ver todos los casos', async () => {
      vi.mocked(mockCaseRepo.list).mockResolvedValueOnce({
        items: [sampleCaseEntity],
        total: 1,
      });

      const useCase = new ListCasesUseCase(mockCaseRepo);
      await useCase.execute(
        {
          page: 1,
          limit: 10,
          filters: {
            ownerId: 'investigador-especifico',
            q: 'callejón',
          },
        },
        adminActor,
      );

      expect(mockCaseRepo.list).toHaveBeenCalledWith(
        expect.objectContaining({
          ownerId: 'investigador-especifico',
          q: 'callejón',
        }),
        1,
        10,
      );
    });
  });

  describe('GetCaseUseCase', () => {
    it('debe retornar el caso sin el campo state si el usuario es el dueño', async () => {
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);

      const useCase = new GetCaseUseCase(mockCaseRepo);
      const result = await useCase.execute(sampleCaseEntity.id, userActor);

      expect(result.id).toBe(sampleCaseEntity.id);
      expect('state' in (result as Record<string, unknown>)).toBe(false);
    });

    it('debe permitir a un ADMIN consultar cualquier caso existente', async () => {
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);

      const useCase = new GetCaseUseCase(mockCaseRepo);
      const result = await useCase.execute(sampleCaseEntity.id, adminActor);

      expect(result.id).toBe(sampleCaseEntity.id);
    });

    it('debe lanzar NotFoundError (404) si un USER intenta acceder a un caso ajeno (Regla 1)', async () => {
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);

      const useCase = new GetCaseUseCase(mockCaseRepo);
      await expect(useCase.execute(sampleCaseEntity.id, otherUserActor)).rejects.toThrow(
        NotFoundError,
      );
    });

    it('debe lanzar NotFoundError si el caso no existe o está inactivo', async () => {
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(null);

      const useCase = new GetCaseUseCase(mockCaseRepo);
      await expect(useCase.execute('no-existe', userActor)).rejects.toThrow(NotFoundError);
    });
  });

  describe('UpdateCaseUseCase', () => {
    it('debe permitir actualizar un caso CLOSED y permitir null para quitar imagen', async () => {
      const closedCaseEntity: CaseEntity = {
        ...sampleCaseEntity,
        status: CaseStatus.CLOSED,
      };
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(closedCaseEntity);
      vi.mocked(mockCaseRepo.update).mockImplementation(
        async (_id: string, data: UpdateCaseData) => ({
          ...closedCaseEntity,
          title: data.title ?? closedCaseEntity.title,
          description: data.description ?? closedCaseEntity.description,
          location: data.location ?? closedCaseEntity.location,
          incidentDate: data.incidentDate ?? closedCaseEntity.incidentDate,
          imageUrl: data.imageUrl !== undefined ? data.imageUrl : closedCaseEntity.imageUrl,
          status: data.status ?? closedCaseEntity.status,
        }),
      );

      const useCase = new UpdateCaseUseCase(mockCaseRepo);
      const result = await useCase.execute(
        closedCaseEntity.id,
        {
          title: 'Homicidio callejón 45 (Reabierto)',
          description: 'Se encontraron nuevas pruebas forenses.',
          location: 'Sector Centro',
          incidentDate: new Date('2026-11-01T22:00:00Z'),
          status: CaseStatus.IN_PROGRESS,
          imageUrl: null, // Quitar la imagen
        },
        userActor,
      );

      expect(mockCaseRepo.update).toHaveBeenCalledWith(
        closedCaseEntity.id,
        expect.objectContaining({
          status: CaseStatus.IN_PROGRESS,
          imageUrl: null,
        }),
      );
      expect(result.status).toBe(CaseStatus.IN_PROGRESS);
      expect(result.imageUrl).toBeNull();
    });

    it('debe lanzar NotFoundError si un USER intenta editar un caso ajeno', async () => {
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);

      const useCase = new UpdateCaseUseCase(mockCaseRepo);
      await expect(
        useCase.execute(
          sampleCaseEntity.id,
          {
            title: 'Título no autorizado',
            description: 'Descripción no autorizada.',
            location: 'Lugar',
            incidentDate: new Date(),
          },
          otherUserActor,
        ),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('DeleteCaseUseCase', () => {
    it('debe llamar a deactivateCascade si el actor es el dueño', async () => {
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);
      vi.mocked(mockCaseRepo.deactivateCascade).mockResolvedValueOnce();

      const useCase = new DeleteCaseUseCase(mockCaseRepo);
      await useCase.execute(sampleCaseEntity.id, userActor);

      expect(mockCaseRepo.deactivateCascade).toHaveBeenCalledWith(sampleCaseEntity.id);
    });

    it('debe lanzar NotFoundError si un USER intenta eliminar un caso ajeno', async () => {
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);

      const useCase = new DeleteCaseUseCase(mockCaseRepo);
      await expect(useCase.execute(sampleCaseEntity.id, otherUserActor)).rejects.toThrow(
        NotFoundError,
      );
      expect(mockCaseRepo.deactivateCascade).not.toHaveBeenCalled();
    });
  });
});
