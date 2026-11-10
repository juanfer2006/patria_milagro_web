'use client';

import { useState, useEffect, useCallback } from 'react';
import { Suspect, SuspectFilters, CreateSuspectInput, UpdateSuspectInput } from '../domain/suspect';
import { suspectsService } from '../services/suspects.service';
import { PaginationMeta } from '../../common/domain/pagination';

export function useSuspects(caseId?: string) {
  const [suspects, setSuspects] = useState<Suspect[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    currentPage: 1,
    limit: 10,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<SuspectFilters>({ caseId });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuspects = useCallback(
    async (page: number = 1) => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await suspectsService.list({ ...filters, caseId }, page, 10);
        setSuspects(res.data);
        setPagination(res.pagination);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cargar sospechosos';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [caseId, filters],
  );

  useEffect(() => {
    fetchSuspects(1);
  }, [fetchSuspects]);

  const createSuspect = async (input: CreateSuspectInput): Promise<Suspect> => {
    const created = await suspectsService.create(input);
    await fetchSuspects(pagination.currentPage);
    return created;
  };

  const updateSuspect = async (id: string, input: UpdateSuspectInput): Promise<Suspect> => {
    const updated = await suspectsService.update(id, input);
    await fetchSuspects(pagination.currentPage);
    return updated;
  };

  const deleteSuspect = async (id: string): Promise<void> => {
    await suspectsService.delete(id);
    await fetchSuspects(pagination.currentPage);
  };

  return {
    suspects,
    pagination,
    filters,
    setFilters,
    isLoading,
    error,
    refresh: () => fetchSuspects(pagination.currentPage),
    goToPage: (page: number) => fetchSuspects(page),
    createSuspect,
    updateSuspect,
    deleteSuspect,
  };
}
