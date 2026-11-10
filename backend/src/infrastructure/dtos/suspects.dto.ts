import { z } from 'zod';
import { SuspectStatus } from '../../domain/models/index.js';
import { paginationQuerySchema } from './pagination.dto.js';

export const createSuspectBodySchema = z.object({
  caseId: z
    .string({ required_error: 'El ID del caso es obligatorio' })
    .uuid('El ID del caso debe ser un UUID válido'),
  fullName: z
    .string({ required_error: 'El nombre completo es obligatorio' })
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(120, 'El nombre no puede exceder 120 caracteres'),
  alias: z
    .union([
      z.string().trim().max(60, 'El alias no puede exceder 60 caracteres'),
      z.literal(''),
      z.null(),
    ])
    .optional()
    .transform((val) => (val === '' ? null : val)),
  description: z
    .union([
      z.string().trim().max(1000, 'La descripción no puede exceder 1000 caracteres'),
      z.literal(''),
      z.null(),
    ])
    .optional()
    .transform((val) => (val === '' ? null : val)),
  suspicionLevel: z.coerce
    .number({ invalid_type_error: 'El nivel de sospecha debe ser un número entero' })
    .int('El nivel de sospecha debe ser un número entero')
    .min(0, 'El nivel de sospecha debe estar entre 0 y 100')
    .max(100, 'El nivel de sospecha debe estar entre 0 y 100')
    .default(0),
  status: z
    .nativeEnum(SuspectStatus, {
      errorMap: () => ({ message: 'El estado del sospechoso no es válido' }),
    })
    .default(SuspectStatus.PERSON_OF_INTEREST),
  photoUrl: z
    .union([z.string().url('La URL de la foto debe ser válida'), z.literal(''), z.null()])
    .optional()
    .transform((val) => (val === '' ? null : val)),
});

export type CreateSuspectBody = z.infer<typeof createSuspectBodySchema>;

export const updateSuspectBodySchema = z.object({
  fullName: z
    .string({ required_error: 'El nombre completo es obligatorio' })
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(120, 'El nombre no puede exceder 120 caracteres')
    .optional(),
  alias: z
    .union([
      z.string().trim().max(60, 'El alias no puede exceder 60 caracteres'),
      z.literal(''),
      z.null(),
    ])
    .optional()
    .transform((val) => (val === '' ? null : val)),
  description: z
    .union([
      z.string().trim().max(1000, 'La descripción no puede exceder 1000 caracteres'),
      z.literal(''),
      z.null(),
    ])
    .optional()
    .transform((val) => (val === '' ? null : val)),
  suspicionLevel: z.coerce
    .number({ invalid_type_error: 'El nivel de sospecha debe ser un número entero' })
    .int('El nivel de sospecha debe ser un número entero')
    .min(0, 'El nivel de sospecha debe estar entre 0 y 100')
    .max(100, 'El nivel de sospecha debe estar entre 0 y 100')
    .optional(),
  status: z
    .nativeEnum(SuspectStatus, {
      errorMap: () => ({ message: 'El estado del sospechoso no es válido' }),
    })
    .optional(),
  photoUrl: z
    .union([z.string().url('La URL de la foto debe ser válida'), z.literal(''), z.null()])
    .optional()
    .transform((val) => (val === '' ? null : val)),
});

export type UpdateSuspectBody = z.infer<typeof updateSuspectBodySchema>;

export const suspectIdParamSchema = z.object({
  id: z.string().uuid('El ID del sospechoso debe ser un UUID válido'),
});

export type SuspectIdParam = z.infer<typeof suspectIdParamSchema>;

export const listSuspectsQuerySchema = paginationQuerySchema.extend({
  caseId: z.string().uuid('El ID del caso debe ser un UUID válido').optional(),
  status: z
    .nativeEnum(SuspectStatus, {
      errorMap: () => ({ message: 'El estado del sospechoso no es válido' }),
    })
    .optional(),
  q: z.string().trim().optional(),
});

export type ListSuspectsQuery = z.infer<typeof listSuspectsQuerySchema>;
