import { describe, it, expect } from 'vitest';
import {
  createEvidenceBodySchema,
  updateEvidenceBodySchema,
  listEvidencesQuerySchema,
} from '../src/infrastructure/dtos/evidences.dto.js';
import { EvidenceType } from '../src/domain/models/index.js';

describe('Evidences DTO Validation (Rebanada D)', () => {
  describe('createEvidenceBodySchema', () => {
    const validData = {
      caseId: '123e4567-e89b-12d3-a456-426614174000',
      suspectId: '223e4567-e89b-12d3-a456-426614174001',
      title: 'Arma blanca con restos biológicos',
      description: 'Cuchillo de cocina hallado en la cocina con manchas hemáticas.',
      type: EvidenceType.PHYSICAL,
      collectedAt: new Date('2026-11-05T14:30:00Z').toISOString(),
      relevance: 4,
      imageUrl: 'https://example.com/knife.jpg',
    };

    it('debe validar un payload de creación válido', () => {
      const parsed = createEvidenceBodySchema.parse(validData);
      expect(parsed.title).toBe(validData.title);
      expect(parsed.relevance).toBe(4);
      expect(parsed.type).toBe(EvidenceType.PHYSICAL);
    });

    it('debe aceptar suspectId e imageUrl opcionales o vacíos y normalizarlos a null', () => {
      const parsed = createEvidenceBodySchema.parse({
        ...validData,
        suspectId: '',
        imageUrl: '',
      });
      expect(parsed.suspectId).toBeNull();
      expect(parsed.imageUrl).toBeNull();
    });

    it('debe rechazar si caseId no es UUID', () => {
      expect(() =>
        createEvidenceBodySchema.parse({
          ...validData,
          caseId: 'not-a-uuid',
        }),
      ).toThrow();
    });

    it('debe rechazar título menor a 3 caracteres o mayor a 120', () => {
      expect(() =>
        createEvidenceBodySchema.parse({
          ...validData,
          title: 'ab',
        }),
      ).toThrow();

      expect(() =>
        createEvidenceBodySchema.parse({
          ...validData,
          title: 'x'.repeat(121),
        }),
      ).toThrow();
    });

    it('debe rechazar descripción menor a 5 caracteres o mayor a 1000', () => {
      expect(() =>
        createEvidenceBodySchema.parse({
          ...validData,
          description: '1234',
        }),
      ).toThrow();

      expect(() =>
        createEvidenceBodySchema.parse({
          ...validData,
          description: 'x'.repeat(1001),
        }),
      ).toThrow();
    });

    it('debe rechazar un tipo de evidencia no reconocido en el enum', () => {
      expect(() =>
        createEvidenceBodySchema.parse({
          ...validData,
          type: 'MAGICAL',
        }),
      ).toThrow();
    });

    it('debe rechazar relevance menor a 1 o mayor a 5', () => {
      expect(() =>
        createEvidenceBodySchema.parse({
          ...validData,
          relevance: 0,
        }),
      ).toThrow();

      expect(() =>
        createEvidenceBodySchema.parse({
          ...validData,
          relevance: 6,
        }),
      ).toThrow();
    });

    it('debe rechazar fecha de recolección futura', () => {
      const future = new Date(Date.now() + 10000000).toISOString();
      expect(() =>
        createEvidenceBodySchema.parse({
          ...validData,
          collectedAt: future,
        }),
      ).toThrow();
    });
  });

  describe('updateEvidenceBodySchema', () => {
    it('debe permitir actualización parcial de campos sin requerir caseId', () => {
      const parsed = updateEvidenceBodySchema.parse({
        title: 'Nuevo título de la evidencia',
        relevance: 5,
      });
      expect(parsed.title).toBe('Nuevo título de la evidencia');
      expect(parsed.relevance).toBe(5);
    });

    it('debe rechazar relevancia inválida en actualización', () => {
      expect(() =>
        updateEvidenceBodySchema.parse({
          relevance: 7,
        }),
      ).toThrow();
    });
  });

  describe('listEvidencesQuerySchema', () => {
    it('debe validar paginación y filtros válidos', () => {
      const parsed = listEvidencesQuerySchema.parse({
        page: '2',
        limit: '15',
        caseId: '123e4567-e89b-12d3-a456-426614174000',
        type: EvidenceType.DIGITAL,
        q: 'disco duro',
      });
      expect(parsed.page).toBe(2);
      expect(parsed.limit).toBe(15);
      expect(parsed.type).toBe(EvidenceType.DIGITAL);
      expect(parsed.q).toBe('disco duro');
    });

    it('debe rechazar límites fuera de rango o negativos', () => {
      expect(() =>
        listEvidencesQuerySchema.parse({
          page: '0',
        }),
      ).toThrow();

      expect(() =>
        listEvidencesQuerySchema.parse({
          limit: '100', // máx 50 según convención
        }),
      ).toThrow();
    });
  });
});
