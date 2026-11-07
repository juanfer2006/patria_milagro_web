import { z } from 'zod';
import { Role } from '../../domain/models/index.js';
import { paginationQuerySchema } from './pagination.dto.js';

export const uuidParamSchema = z.object({
  id: z.string().uuid('El identificador debe ser un UUID válido'),
});

export const listUsersQuerySchema = paginationQuerySchema.extend({
  q: z.string().trim().optional(),
  role: z
    .nativeEnum(Role, { errorMap: () => ({ message: 'El rol debe ser ADMIN o USER' }) })
    .optional(),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
