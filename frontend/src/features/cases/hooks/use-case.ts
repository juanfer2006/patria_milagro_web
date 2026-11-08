'use client';

import { useState, useEffect, useCallback } from 'react';
import { Case } from '../domain/case';
import { casesService } from '../services/cases.service';
import { isApiError } from '../../common/domain/api-error';

export function useCase(id: string) {
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const fetchCase = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    setIsNotFound(false);

    try {
      const data = await casesService.getById(id);
      setCaseData(data);
    } catch (err: unknown) {
      if (isApiError(err)) {
        if (err.status === 404) {
          setIsNotFound(true);
        } else {
          setError(err.message);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error inesperado al cargar el caso forense');
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  return {
    caseData,
    isLoading,
    error,
    isNotFound,
    refetch: fetchCase,
  };
}
