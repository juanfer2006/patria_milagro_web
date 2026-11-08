'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Case, CaseStatus } from '../domain/case';
import { casesService, ListCasesParams } from '../services/cases.service';
import { PaginationMeta } from '../../common/domain/pagination';
import { isApiError } from '../../common/domain/api-error';

export interface UseCasesFilters {
  q: string;
  status: CaseStatus | '';
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  ownerId?: string;
}

export function useCases(initialOwnerId?: string) {
  const [cases, setCases] = useState<Case[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    currentPage: 1,
    limit: 10,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<UseCasesFilters>({
    q: '',
    status: '',
    from: '',
    to: '',
    ownerId: initialOwnerId,
  });

  const [debouncedQ, setDebouncedQ] = useState<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce para el término de búsqueda (~400 ms)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQ(filters.q);
    }, 400);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filters.q]);

  const setFilter = useCallback(
    <K extends keyof UseCasesFilters>(key: K, value: UseCasesFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      // Cualquier cambio de filtro reinicia a la página 1
      setPage(1);
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters({
      q: '',
      status: '',
      from: '',
      to: '',
      ownerId: initialOwnerId,
    });
    setPage(1);
  }, [initialOwnerId]);

  const fetchCases = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const params: ListCasesParams = {
      page,
      limit: 10,
    };

    if (debouncedQ.trim()) {
      params.q = debouncedQ.trim();
    }

    if (filters.status) {
      params.status = filters.status;
    }

    if (filters.from) {
      const [year, month, day] = filters.from.split('-').map(Number);
      if (year && month && day) {
        const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
        params.from = startOfDay.toISOString();
      }
    }

    if (filters.to) {
      const [year, month, day] = filters.to.split('-').map(Number);
      if (year && month && day) {
        const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
        params.to = endOfDay.toISOString();
      }
    }

    if (filters.ownerId) {
      params.ownerId = filters.ownerId;
    }

    try {
      const response = await casesService.list(params);
      setCases(response.data);
      setPagination(response.pagination);
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('No fue posible cargar el listado de casos forenses');
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedQ, filters.status, filters.from, filters.to, filters.ownerId]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const removeCase = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await casesService.remove(id);
        // Si se elimina el último elemento de una página mayor a 1, retrocede una página
        if (cases.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        } else {
          await fetchCases();
        }
        return true;
      } catch (err: unknown) {
        if (isApiError(err)) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error al eliminar el expediente');
        }
        return false;
      }
    },
    [cases.length, page, fetchCases],
  );

  return {
    cases,
    pagination,
    isLoading,
    error,
    page,
    setPage,
    filters,
    setFilter,
    resetFilters,
    refetch: fetchCases,
    removeCase,
  };
}
