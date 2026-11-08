import { describe, it, expect } from 'vitest';
import {
  listCasesQuerySchema,
  createCaseBodySchema,
  updateCaseBodySchema,
} from '../src/infrastructure/dtos/cases.dto.js';
import { CaseStatus } from '../src/domain/models/index.js';

describe('Cases DTOs Validation', () => {
  describe('listCasesQuerySchema', () => {
    it('debe aceptar valores por defecto de paginación', () => {
      const result = listCasesQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it('debe rechazar page = 0', () => {
      const result = listCasesQuerySchema.safeParse({ page: 0 });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.errors.find((e) => e.path.includes('page'));
        expect(error?.message).toContain('mayor o igual a 1');
      }
    });

    it('debe rechazar limit no numérico ("abc")', () => {
      const result = listCasesQuerySchema.safeParse({ limit: 'abc' });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.errors.find((e) => e.path.includes('limit'));
        expect(error?.message).toContain('numérico');
      }
    });

    it('debe rechazar limit superior a 50 (limit = 100)', () => {
      const result = listCasesQuerySchema.safeParse({ limit: 100 });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.errors.find((e) => e.path.includes('limit'));
        expect(error?.message).toContain('no puede exceder 50');
      }
    });

    it('debe rechazar rango cuando from es posterior a to', () => {
      const result = listCasesQuerySchema.safeParse({
        from: '2026-11-10T00:00:00Z',
        to: '2026-11-05T00:00:00Z',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.errors.find((e) => e.path.includes('from'));
        expect(error?.message).toContain('no puede ser posterior');
      }
    });

    it('debe aceptar rango válido cuando from es anterior o igual a to', () => {
      const result = listCasesQuerySchema.safeParse({
        from: '2026-11-01T00:00:00Z',
        to: '2026-11-05T00:00:00Z',
      });
      expect(result.success).toBe(true);
    });

    it('debe rechazar ownerId si no es un UUID válido', () => {
      const result = listCasesQuerySchema.safeParse({ ownerId: '123-invalido' });
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.errors.find((e) => e.path.includes('ownerId'));
        expect(error?.message).toContain('UUID');
      }
    });
  });

  describe('createCaseBodySchema', () => {
    const validCase = {
      title: 'Caso Válido',
      description: 'Esta es una descripción detallada de más de 10 caracteres.',
      location: 'Centro de la ciudad',
      incidentDate: '2026-11-05T12:00:00Z',
      status: CaseStatus.OPEN,
      imageUrl: 'https://example.com/imagen.png',
    };

    it('debe aceptar un caso con todos los campos válidos', () => {
      const result = createCaseBodySchema.safeParse(validCase);
      expect(result.success).toBe(true);
    });

    it('debe rechazar título menor a 3 caracteres o mayor a 120', () => {
      const tooShort = createCaseBodySchema.safeParse({ ...validCase, title: 'ab' });
      expect(tooShort.success).toBe(false);

      const tooLong = createCaseBodySchema.safeParse({ ...validCase, title: 'a'.repeat(121) });
      expect(tooLong.success).toBe(false);
    });

    it('debe rechazar descripción menor a 10 caracteres o mayor a 2000', () => {
      const tooShort = createCaseBodySchema.safeParse({ ...validCase, description: 'corta' });
      expect(tooShort.success).toBe(false);

      const tooLong = createCaseBodySchema.safeParse({
        ...validCase,
        description: 'a'.repeat(2001),
      });
      expect(tooLong.success).toBe(false);
    });

    it('debe rechazar ubicación menor a 3 caracteres o mayor a 120', () => {
      const tooShort = createCaseBodySchema.safeParse({ ...validCase, location: 'ab' });
      expect(tooShort.success).toBe(false);

      const tooLong = createCaseBodySchema.safeParse({ ...validCase, location: 'a'.repeat(121) });
      expect(tooLong.success).toBe(false);
    });

    it('debe rechazar una fecha inválida', () => {
      const result = createCaseBodySchema.safeParse({ ...validCase, incidentDate: 'fecha-falsa' });
      expect(result.success).toBe(false);
    });

    it('debe rechazar un imageUrl no válido', () => {
      const result = createCaseBodySchema.safeParse({ ...validCase, imageUrl: 'no-es-url' });
      expect(result.success).toBe(false);
    });
  });

  describe('updateCaseBodySchema', () => {
    it('debe permitir null para imageUrl para desvincular imagen', () => {
      const result = updateCaseBodySchema.safeParse({
        title: 'Actualización de caso',
        description: 'Descripción con suficiente extensión para ser válida.',
        location: 'Sector Norte',
        incidentDate: '2026-11-06T15:00:00Z',
        imageUrl: null,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.imageUrl).toBeNull();
      }
    });
  });
});
