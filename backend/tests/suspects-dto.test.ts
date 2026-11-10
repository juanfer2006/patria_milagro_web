import { describe, it, expect } from 'vitest';
import {
  createSuspectBodySchema,
  updateSuspectBodySchema,
  suspectIdParamSchema,
  listSuspectsQuerySchema,
} from '../src/infrastructure/dtos/suspects.dto.js';
import { SuspectStatus } from '../src/domain/models/enums.js';

describe('Suspects DTO Validations', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  describe('createSuspectBodySchema', () => {
    it('debe validar un payload de sospechoso válido completo', () => {
      const data = {
        caseId: validUuid,
        fullName: 'Carlos Mendoza',
        alias: 'El Fantasma',
        description: 'Visto en inmediaciones del puerto.',
        suspicionLevel: 75,
        status: SuspectStatus.PERSON_OF_INTEREST,
        photoUrl: 'https://images.supabase.co/suspects/carlos.jpg',
      };

      const result = createSuspectBodySchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.fullName).toBe('Carlos Mendoza');
        expect(result.data.suspicionLevel).toBe(75);
      }
    });

    it('debe asignar valores por defecto a suspicionLevel (0) y status (PERSON_OF_INTEREST)', () => {
      const data = {
        caseId: validUuid,
        fullName: 'Juan Nadie',
      };

      const result = createSuspectBodySchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.suspicionLevel).toBe(0);
        expect(result.data.status).toBe(SuspectStatus.PERSON_OF_INTEREST);
      }
    });

    it('debe fallar si caseId no es UUID', () => {
      const data = {
        caseId: 'invalido',
        fullName: 'Juan Perez',
      };

      const result = createSuspectBodySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('debe fallar si el nombre tiene menos de 3 caracteres', () => {
      const data = {
        caseId: validUuid,
        fullName: 'Al',
      };

      const result = createSuspectBodySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('debe fallar si suspicionLevel está fuera de rango (menor a 0 o mayor a 100)', () => {
      const dataLow = {
        caseId: validUuid,
        fullName: 'Juan Perez',
        suspicionLevel: -5,
      };
      const dataHigh = {
        caseId: validUuid,
        fullName: 'Juan Perez',
        suspicionLevel: 105,
      };

      expect(createSuspectBodySchema.safeParse(dataLow).success).toBe(false);
      expect(createSuspectBodySchema.safeParse(dataHigh).success).toBe(false);
    });

    it('debe transformar cadenas vacías de alias, description y photoUrl a null', () => {
      const data = {
        caseId: validUuid,
        fullName: 'Pedro Gomez',
        alias: '',
        description: '',
        photoUrl: '',
      };

      const result = createSuspectBodySchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.alias).toBeNull();
        expect(result.data.description).toBeNull();
        expect(result.data.photoUrl).toBeNull();
      }
    });
  });

  describe('updateSuspectBodySchema', () => {
    it('debe permitir actualización parcial de campos', () => {
      const data = {
        alias: 'El Silencioso',
        status: SuspectStatus.DETAINED,
        suspicionLevel: 90,
      };

      const result = updateSuspectBodySchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe(SuspectStatus.DETAINED);
        expect(result.data.suspicionLevel).toBe(90);
      }
    });

    it('debe fallar si se envía un suspicionLevel inválido', () => {
      const data = {
        suspicionLevel: 150,
      };

      const result = updateSuspectBodySchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('suspectIdParamSchema', () => {
    it('debe validar un UUID en los parámetros', () => {
      expect(suspectIdParamSchema.safeParse({ id: validUuid }).success).toBe(true);
      expect(suspectIdParamSchema.safeParse({ id: 'no-uuid' }).success).toBe(false);
    });
  });

  describe('listSuspectsQuerySchema', () => {
    it('debe validar paginación y filtros válidos', () => {
      const query = {
        page: '2',
        limit: '15',
        caseId: validUuid,
        status: SuspectStatus.CLEARED,
        q: 'Mendoza',
      };

      const result = listSuspectsQuerySchema.safeParse(query);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(15);
        expect(result.data.status).toBe(SuspectStatus.CLEARED);
        expect(result.data.q).toBe('Mendoza');
      }
    });
  });
});
