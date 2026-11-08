import { z } from 'zod';
import { CaseStatus } from '../../domain/models/index.js';
import { paginationQuerySchema } from './pagination.dto.js';

export const createCaseBodySchema = z.object({
  title: z
    .string({ required_error: 'El título es obligatorio' })
    .trim()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(120, 'El título no puede exceder 120 caracteres'),
  description: z
    .string({ required_error: 'La descripción es obligatorio' })
    .trim()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres'),
  location: z
    .string({ required_error: 'La ubicación es obligatoria' })
    .trim()
    .min(3, 'La ubicación debe tener al menos 3 caracteres')
    .max(120, 'La ubicación no puede exceder 120 caracteres'),
  incidentDate: z.coerce.date({
    invalid_type_error: 'La fecha del incidente debe ser una fecha válida',
    required_error: 'La fecha del incidente es obligatoria',
  }),
  status: z
    .nativeEnum(CaseStatus, {
      errorMap: () => ({ message: 'El estado del caso no es válido' }),
    })
    .optional(),
  imageUrl: z.union([z.string().url('La URL de la imagen debe ser válida'), z.null()]).optional(),
});

export type CreateCaseBody = z.infer<typeof createCaseBodySchema>;

export const updateCaseBodySchema = z.object({
  title: z
    .string({ required_error: 'El título es obligatorio' })
    .trim()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(120, 'El título no puede exceder 120 caracteres'),
  description: z
    .string({ required_error: 'La descripción es obligatorio' })
    .trim()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres'),
  location: z
    .string({ required_error: 'La ubicación es obligatoria' })
    .trim()
    .min(3, 'La ubicación debe tener al menos 3 caracteres')
    .max(120, 'La ubicación no puede exceder 120 caracteres'),
  incidentDate: z.coerce.date({
    invalid_type_error: 'La fecha del incidente debe ser una fecha válida',
    required_error: 'La fecha del incidente es obligatoria',
  }),
  status: z
    .nativeEnum(CaseStatus, {
      errorMap: () => ({ message: 'El estado del caso no es válido' }),
    })
    .optional(),
  imageUrl: z.union([z.string().url('La URL de la imagen debe ser válida'), z.null()]).optional(),
});

export type UpdateCaseBody = z.infer<typeof updateCaseBodySchema>;

export const listCasesQuerySchema = paginationQuerySchema
  .extend({
    q: z.string().trim().optional(),
    status: z
      .nativeEnum(CaseStatus, {
        errorMap: () => ({ message: 'El estado del caso no es válido' }),
      })
      .optional(),
    from: z.coerce
      .date({ invalid_type_error: 'La fecha inicial (from) debe ser una fecha válida' })
      .optional(),
    to: z.coerce
      .date({ invalid_type_error: 'La fecha final (to) debe ser una fecha válida' })
      .optional(),
    ownerId: z.string().uuid('El ID de propietario debe ser un UUID válido').optional(),
  })
  .refine(
    (data) => {
      if (data.from && data.to) {
        return data.from.getTime() <= data.to.getTime();
      }
      return true;
    },
    {
      message: 'La fecha inicial (from) no puede ser posterior a la fecha final (to)',
      path: ['from'],
    },
  );

export type ListCasesQuery = z.infer<typeof listCasesQuerySchema>;
