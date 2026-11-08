import { z } from 'zod';
import { EvidenceType } from '../../domain/models/index.js';
import { paginationQuerySchema } from './pagination.dto.js';

export const createEvidenceBodySchema = z.object({
  caseId: z
    .string({ required_error: 'El ID del caso es obligatorio' })
    .uuid('El ID del caso debe ser un UUID válido'),
  suspectId: z
    .union([
      z.string().uuid('El ID del sospechoso debe ser un UUID válido'),
      z.literal(''),
      z.null(),
    ])
    .optional()
    .transform((val) => (val === '' ? null : val)),
  title: z
    .string({ required_error: 'El título es obligatorio' })
    .trim()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(120, 'El título no puede exceder 120 caracteres'),
  description: z
    .string({ required_error: 'La descripción es obligatoria' })
    .trim()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),
  type: z.nativeEnum(EvidenceType, {
    errorMap: () => ({ message: 'El tipo de evidencia no es válido' }),
  }),
  collectedAt: z.coerce
    .date({
      invalid_type_error: 'La fecha de recolección debe ser una fecha válida',
      required_error: 'La fecha de recolección es obligatoria',
    })
    .refine((date) => date.getTime() <= Date.now() + 60000, {
      message: 'La fecha de recolección no puede ser futura',
    }),
  relevance: z.coerce
    .number({
      required_error: 'El nivel de relevancia es obligatorio',
      invalid_type_error: 'La relevancia debe ser un número entero',
    })
    .int('La relevancia debe ser un número entero')
    .min(1, 'La relevancia mínima permitida es 1')
    .max(5, 'La relevancia máxima permitida es 5'),
  imageUrl: z
    .union([z.string().url('La URL de la imagen debe ser válida'), z.literal(''), z.null()])
    .optional()
    .transform((val) => (val === '' ? null : val)),
});

export type CreateEvidenceBody = z.infer<typeof createEvidenceBodySchema>;

export const updateEvidenceBodySchema = z.object({
  suspectId: z
    .union([
      z.string().uuid('El ID del sospechoso debe ser un UUID válido'),
      z.literal(''),
      z.null(),
    ])
    .optional()
    .transform((val) => (val === '' ? null : val)),
  title: z
    .string({ required_error: 'El título es obligatorio' })
    .trim()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(120, 'El título no puede exceder 120 caracteres')
    .optional(),
  description: z
    .string({ required_error: 'La descripción es obligatoria' })
    .trim()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),
  type: z
    .nativeEnum(EvidenceType, {
      errorMap: () => ({ message: 'El tipo de evidencia no es válido' }),
    })
    .optional(),
  collectedAt: z.coerce
    .date({
      invalid_type_error: 'La fecha de recolección debe ser una fecha válida',
    })
    .refine((date) => date.getTime() <= Date.now() + 60000, {
      message: 'La fecha de recolección no puede ser futura',
    })
    .optional(),
  relevance: z.coerce
    .number({
      invalid_type_error: 'La relevancia debe ser un número entero',
    })
    .int('La relevancia debe ser un número entero')
    .min(1, 'La relevancia mínima permitida es 1')
    .max(5, 'La relevancia máxima permitida es 5')
    .optional(),
  imageUrl: z
    .union([z.string().url('La URL de la imagen debe ser válida'), z.literal(''), z.null()])
    .optional()
    .transform((val) => (val === '' ? null : val)),
});

export type UpdateEvidenceBody = z.infer<typeof updateEvidenceBodySchema>;

export const listEvidencesQuerySchema = paginationQuerySchema.extend({
  caseId: z.string().uuid('El ID del caso debe ser un UUID válido').optional(),
  suspectId: z.string().uuid('El ID del sospechoso debe ser un UUID válido').optional(),
  type: z
    .nativeEnum(EvidenceType, {
      errorMap: () => ({ message: 'El tipo de evidencia no es válido' }),
    })
    .optional(),
  q: z.string().trim().optional(),
});

export type ListEvidencesQuery = z.infer<typeof listEvidencesQuerySchema>;
