import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  CreateEvidenceUseCase,
  ListEvidencesUseCase,
  GetEvidenceUseCase,
  UpdateEvidenceUseCase,
  DeleteEvidenceUseCase,
} from '../src/application/use-cases/evidences/index.js';
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from '../src/application/errors/app-error.js';
import {
  Role,
  RecordState,
  CaseStatus,
  SuspectStatus,
  EvidenceType,
  CaseEntity,
  SuspectEntity,
  EvidenceEntity,
  Actor,
} from '../src/domain/models/index.js';
import {
  IEvidenceRepository,
  ICaseRepository,
  ISuspectRepository,
  CreateEvidenceData,
  UpdateEvidenceData,
} from '../src/domain/repository/index.js';

describe('Evidences Use Cases (Rebanada D)', () => {
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
    id: 'case-uuid-1',
    caseNumber: 1,
    title: 'Homicidio en callejón noir',
    description: 'Investigación preliminar de la escena del crimen.',
    location: 'Sector Central',
    incidentDate: new Date('2026-11-01T20:00:00Z'),
    status: CaseStatus.OPEN,
    imageUrl: 'https://example.com/scene.jpg',
    state: RecordState.ACTIVE,
    ownerId: 'user-uuid-1',
    createdAt: new Date('2026-11-02T10:00:00Z'),
    updatedAt: new Date('2026-11-02T10:00:00Z'),
  };

  const closedCaseEntity: CaseEntity = {
    ...sampleCaseEntity,
    id: 'case-closed-uuid',
    status: CaseStatus.CLOSED,
  };

  const sampleSuspectEntity: SuspectEntity = {
    id: 'suspect-uuid-1',
    fullName: 'Carlos Mendoza',
    alias: 'El Sombrío',
    description: 'Visto cerca de la escena',
    suspicionLevel: 75,
    status: SuspectStatus.PERSON_OF_INTEREST,
    photoUrl: 'https://example.com/suspect.jpg',
    state: RecordState.ACTIVE,
    caseId: 'case-uuid-1',
    createdAt: new Date('2026-11-02T11:00:00Z'),
    updatedAt: new Date('2026-11-02T11:00:00Z'),
  };

  const foreignSuspectEntity: SuspectEntity = {
    id: 'suspect-uuid-foreign',
    fullName: 'Sospechoso de otro caso',
    alias: null,
    description: null,
    suspicionLevel: 50,
    status: SuspectStatus.PERSON_OF_INTEREST,
    photoUrl: null,
    state: RecordState.ACTIVE,
    caseId: 'case-uuid-other',
    createdAt: new Date('2026-11-02T11:00:00Z'),
    updatedAt: new Date('2026-11-02T11:00:00Z'),
  };

  const sampleEvidenceEntity: EvidenceEntity = {
    id: 'evidence-uuid-1',
    title: 'Casquillo 9mm percutido',
    description: 'Encontrado a dos metros del cuerpo sobre el pavimento húmedo.',
    type: EvidenceType.PHYSICAL,
    collectedAt: new Date('2026-11-01T21:30:00Z'),
    relevance: 4,
    imageUrl: 'https://example.com/bullet.jpg',
    state: RecordState.ACTIVE,
    caseId: 'case-uuid-1',
    suspectId: 'suspect-uuid-1',
    createdAt: new Date('2026-11-02T12:00:00Z'),
    updatedAt: new Date('2026-11-02T12:00:00Z'),
  };

  const mockEvidenceRepo: IEvidenceRepository = {
    create: vi.fn(),
    findById: vi.fn(),
    list: vi.fn(),
    update: vi.fn(),
    deactivate: vi.fn(),
  };

  const mockCaseRepo: ICaseRepository = {
    create: vi.fn(),
    findById: vi.fn(),
    list: vi.fn(),
    update: vi.fn(),
    deactivateCascade: vi.fn(),
  };

  const mockSuspectRepo: ISuspectRepository = {
    create: vi.fn(),
    findById: vi.fn(),
    list: vi.fn(),
    update: vi.fn(),
    deactivateAndUnlinkEvidences: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CreateEvidenceUseCase', () => {
    it('debe crear una evidencia con datos válidos y no exponer el campo state', async () => {
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);
      vi.mocked(mockSuspectRepo.findById).mockResolvedValueOnce(sampleSuspectEntity);
      vi.mocked(mockEvidenceRepo.create).mockImplementation(async (data: CreateEvidenceData) => ({
        id: 'new-evidence-uuid',
        title: data.title,
        description: data.description,
        type: data.type,
        collectedAt: data.collectedAt,
        relevance: data.relevance,
        imageUrl: data.imageUrl ?? null,
        state: RecordState.ACTIVE,
        caseId: data.caseId,
        suspectId: data.suspectId ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const useCase = new CreateEvidenceUseCase(mockEvidenceRepo, mockCaseRepo, mockSuspectRepo);
      const result = await useCase.execute(
        {
          caseId: 'case-uuid-1',
          suspectId: 'suspect-uuid-1',
          title: 'Huella dactilar parcial',
          description: 'Recuperada del pomo de la puerta principal.',
          type: EvidenceType.FORENSIC,
          collectedAt: new Date('2026-11-01T23:00:00Z'),
          relevance: 5,
          imageUrl: 'https://example.com/fingerprint.jpg',
        },
        userActor,
      );

      expect(mockEvidenceRepo.create).toHaveBeenCalledTimes(1);
      expect(result.id).toBe('new-evidence-uuid');
      expect(result.title).toBe('Huella dactilar parcial');
      expect(result.relevance).toBe(5);
      expect('state' in (result as unknown as Record<string, unknown>)).toBe(false);
    });

    it('debe lanzar NotFoundError (404) si el caso no existe o pertenece a otro usuario (Regla 1)', async () => {
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);

      const useCase = new CreateEvidenceUseCase(mockEvidenceRepo, mockCaseRepo, mockSuspectRepo);
      await expect(
        useCase.execute(
          {
            caseId: 'case-uuid-1',
            title: 'Grabación de seguridad',
            description: 'Video de la cámara del callejón.',
            type: EvidenceType.DIGITAL,
            collectedAt: new Date('2026-11-01T21:00:00Z'),
            relevance: 3,
          },
          otherUserActor,
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it('debe lanzar ConflictError (409) si el caso está CLOSED (Regla 3)', async () => {
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(closedCaseEntity);

      const useCase = new CreateEvidenceUseCase(mockEvidenceRepo, mockCaseRepo, mockSuspectRepo);
      await expect(
        useCase.execute(
          {
            caseId: 'case-closed-uuid',
            title: 'Documento confidencial',
            description: 'Informe posterior al cierre.',
            type: EvidenceType.DOCUMENT,
            collectedAt: new Date('2026-11-01T21:00:00Z'),
            relevance: 2,
          },
          userActor,
        ),
      ).rejects.toThrow(ConflictError);
    });

    it('debe lanzar ValidationError (400) si el sospechoso no pertenece al mismo caso (Regla 4)', async () => {
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);
      vi.mocked(mockSuspectRepo.findById).mockResolvedValueOnce(foreignSuspectEntity);

      const useCase = new CreateEvidenceUseCase(mockEvidenceRepo, mockCaseRepo, mockSuspectRepo);
      await expect(
        useCase.execute(
          {
            caseId: 'case-uuid-1',
            suspectId: 'suspect-uuid-foreign',
            title: 'Teléfono celular',
            description: 'Aparato incautado con mensajes.',
            type: EvidenceType.DIGITAL,
            collectedAt: new Date('2026-11-01T21:00:00Z'),
            relevance: 3,
          },
          userActor,
        ),
      ).rejects.toThrow(ValidationError);
    });

    it('debe lanzar ValidationError (400) si la fecha de recolección es futura', async () => {
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);

      const useCase = new CreateEvidenceUseCase(mockEvidenceRepo, mockCaseRepo, mockSuspectRepo);
      const futureDate = new Date(Date.now() + 86400000); // Mañana

      await expect(
        useCase.execute(
          {
            caseId: 'case-uuid-1',
            title: 'Declaración futura',
            description: 'Testimonio con fecha errónea.',
            type: EvidenceType.TESTIMONY,
            collectedAt: futureDate,
            relevance: 2,
          },
          userActor,
        ),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('ListEvidencesUseCase', () => {
    it('debe forzar ownerId al ID del actor cuando es USER (aislamiento)', async () => {
      vi.mocked(mockEvidenceRepo.list).mockResolvedValueOnce({
        items: [sampleEvidenceEntity],
        total: 1,
      });

      const useCase = new ListEvidencesUseCase(mockEvidenceRepo, mockCaseRepo);
      const result = await useCase.execute(
        {
          page: 1,
          limit: 10,
          filters: {},
        },
        userActor,
      );

      expect(mockEvidenceRepo.list).toHaveBeenCalledWith(
        expect.objectContaining({ ownerId: userActor.id }),
        1,
        10,
      );
      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it('debe permitir a un ADMIN listar evidencias de todos los usuarios o filtrar por ownerId', async () => {
      vi.mocked(mockEvidenceRepo.list).mockResolvedValueOnce({
        items: [sampleEvidenceEntity],
        total: 1,
      });

      const useCase = new ListEvidencesUseCase(mockEvidenceRepo, mockCaseRepo);
      await useCase.execute(
        {
          page: 1,
          limit: 10,
          filters: { ownerId: 'any-user-uuid' },
        },
        adminActor,
      );

      expect(mockEvidenceRepo.list).toHaveBeenCalledWith(
        expect.objectContaining({ ownerId: 'any-user-uuid' }),
        1,
        10,
      );
    });

    it('debe combinar filtros caseId, suspectId, type y q', async () => {
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);
      vi.mocked(mockEvidenceRepo.list).mockResolvedValueOnce({
        items: [sampleEvidenceEntity],
        total: 1,
      });

      const useCase = new ListEvidencesUseCase(mockEvidenceRepo, mockCaseRepo);
      await useCase.execute(
        {
          page: 1,
          limit: 10,
          filters: {
            caseId: 'case-uuid-1',
            suspectId: 'suspect-uuid-1',
            type: EvidenceType.PHYSICAL,
            q: 'casquillo',
          },
        },
        userActor,
      );

      expect(mockEvidenceRepo.list).toHaveBeenCalledWith(
        expect.objectContaining({
          caseId: 'case-uuid-1',
          suspectId: 'suspect-uuid-1',
          type: EvidenceType.PHYSICAL,
          q: 'casquillo',
        }),
        1,
        10,
      );
    });

    it('debe lanzar NotFoundError (404) si un USER filtra por caseId ajeno o inexistente', async () => {
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);

      const useCase = new ListEvidencesUseCase(mockEvidenceRepo, mockCaseRepo);
      await expect(
        useCase.execute(
          {
            page: 1,
            limit: 10,
            filters: { caseId: 'case-uuid-1' },
          },
          otherUserActor,
        ),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('GetEvidenceUseCase', () => {
    it('debe retornar la evidencia si el usuario es dueño del caso', async () => {
      vi.mocked(mockEvidenceRepo.findById).mockResolvedValueOnce(sampleEvidenceEntity);
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);

      const useCase = new GetEvidenceUseCase(mockEvidenceRepo, mockCaseRepo);
      const result = await useCase.execute('evidence-uuid-1', userActor);

      expect(result.id).toBe('evidence-uuid-1');
      expect(result.title).toBe(sampleEvidenceEntity.title);
      expect('state' in (result as unknown as Record<string, unknown>)).toBe(false);
    });

    it('debe lanzar NotFoundError (404) si la evidencia no existe', async () => {
      vi.mocked(mockEvidenceRepo.findById).mockResolvedValueOnce(null);

      const useCase = new GetEvidenceUseCase(mockEvidenceRepo, mockCaseRepo);
      await expect(useCase.execute('missing-uuid', userActor)).rejects.toThrow(NotFoundError);
    });

    it('debe lanzar NotFoundError (404) si el usuario no es dueño del caso asociado', async () => {
      vi.mocked(mockEvidenceRepo.findById).mockResolvedValueOnce(sampleEvidenceEntity);
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);

      const useCase = new GetEvidenceUseCase(mockEvidenceRepo, mockCaseRepo);
      await expect(useCase.execute('evidence-uuid-1', otherUserActor)).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('UpdateEvidenceUseCase', () => {
    it('debe actualizar campos de la evidencia con éxito', async () => {
      vi.mocked(mockEvidenceRepo.findById).mockResolvedValueOnce(sampleEvidenceEntity);
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);
      vi.mocked(mockEvidenceRepo.update).mockImplementation(
        async (_id: string, data: UpdateEvidenceData) => ({
          ...sampleEvidenceEntity,
          title: data.title ?? sampleEvidenceEntity.title,
          relevance: data.relevance ?? sampleEvidenceEntity.relevance,
        }),
      );

      const useCase = new UpdateEvidenceUseCase(mockEvidenceRepo, mockCaseRepo, mockSuspectRepo);
      const result = await useCase.execute(
        'evidence-uuid-1',
        {
          title: 'Casquillo 9mm percutido (calibrado)',
          relevance: 5,
        },
        userActor,
      );

      expect(result.title).toBe('Casquillo 9mm percutido (calibrado)');
      expect(result.relevance).toBe(5);
    });

    it('debe permitir editar evidencias incluso si el caso está cerrado (la regla 3 solo aplica a creación)', async () => {
      vi.mocked(mockEvidenceRepo.findById).mockResolvedValueOnce({
        ...sampleEvidenceEntity,
        caseId: 'case-closed-uuid',
      });
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(closedCaseEntity);
      vi.mocked(mockEvidenceRepo.update).mockImplementation(
        async (_id: string, data: UpdateEvidenceData) => ({
          ...sampleEvidenceEntity,
          caseId: 'case-closed-uuid',
          description: data.description ?? sampleEvidenceEntity.description,
        }),
      );

      const useCase = new UpdateEvidenceUseCase(mockEvidenceRepo, mockCaseRepo, mockSuspectRepo);
      const result = await useCase.execute(
        'evidence-uuid-1',
        { description: 'Actualización forense permitida en caso cerrado' },
        userActor,
      );

      expect(result.description).toBe('Actualización forense permitida en caso cerrado');
    });

    it('debe lanzar ValidationError (400) si al editar se asocia un suspectId de otro caso (Regla 4)', async () => {
      vi.mocked(mockEvidenceRepo.findById).mockResolvedValueOnce(sampleEvidenceEntity);
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);
      vi.mocked(mockSuspectRepo.findById).mockResolvedValueOnce(foreignSuspectEntity);

      const useCase = new UpdateEvidenceUseCase(mockEvidenceRepo, mockCaseRepo, mockSuspectRepo);
      await expect(
        useCase.execute('evidence-uuid-1', { suspectId: 'suspect-uuid-foreign' }, userActor),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('DeleteEvidenceUseCase', () => {
    it('debe desactivar la evidencia lógicamente (204)', async () => {
      vi.mocked(mockEvidenceRepo.findById).mockResolvedValueOnce(sampleEvidenceEntity);
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);

      const useCase = new DeleteEvidenceUseCase(mockEvidenceRepo, mockCaseRepo);
      await useCase.execute('evidence-uuid-1', userActor);

      expect(mockEvidenceRepo.deactivate).toHaveBeenCalledWith('evidence-uuid-1');
    });

    it('debe permitir eliminar evidencias aun si el caso está cerrado', async () => {
      vi.mocked(mockEvidenceRepo.findById).mockResolvedValueOnce({
        ...sampleEvidenceEntity,
        caseId: 'case-closed-uuid',
      });
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(closedCaseEntity);

      const useCase = new DeleteEvidenceUseCase(mockEvidenceRepo, mockCaseRepo);
      await useCase.execute('evidence-uuid-1', userActor);

      expect(mockEvidenceRepo.deactivate).toHaveBeenCalledWith('evidence-uuid-1');
    });

    it('debe lanzar NotFoundError (404) si un usuario ajeno intenta eliminar la evidencia', async () => {
      vi.mocked(mockEvidenceRepo.findById).mockResolvedValueOnce(sampleEvidenceEntity);
      vi.mocked(mockCaseRepo.findById).mockResolvedValueOnce(sampleCaseEntity);

      const useCase = new DeleteEvidenceUseCase(mockEvidenceRepo, mockCaseRepo);
      await expect(useCase.execute('evidence-uuid-1', otherUserActor)).rejects.toThrow(
        NotFoundError,
      );
    });
  });
});
