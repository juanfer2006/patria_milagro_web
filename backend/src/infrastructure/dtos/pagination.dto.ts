import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z.coerce
    .number({ invalid_type_error: 'El parámetro page debe ser numérico' })
    .int('El parámetro page debe ser un número entero')
    .min(1, 'El parámetro page debe ser mayor o igual a 1')
    .default(1),
  limit: z.coerce
    .number({ invalid_type_error: 'El parámetro limit debe ser numérico' })
    .int('El parámetro limit debe ser un número entero')
    .min(1, 'El parámetro limit debe ser mayor o igual a 1')
    .max(50, 'El parámetro limit no puede exceder 50')
    .default(10),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export interface PaginationMeta {
  total: number;
  currentPage: number;
  limit: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: PaginationMeta;
}

export function buildPagination(total: number, page: number, limit: number): PaginationMeta {
  return {
    total,
    currentPage: page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}
