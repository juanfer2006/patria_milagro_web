'use client';

import { useState, useEffect, useCallback } from 'react';
import { Evidence } from '../domain/evidence';
import {
  evidencesService,
  CreateEvidencePayload,
  UpdateEvidencePayload,
} from '../services/evidences.service';
import { fetchCaseSuspectsLookup, SuspectLookupOption } from '../services/suspects-lookup';
import { ApiError } from '../../common/domain/api-error';

export function useEvidences(caseId: string) {
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [suspects, setSuspects] = useState<SuspectLookupOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadSuspects = useCallback(async () => {
    if (!caseId) return;
    try {
      const suspectsData = await fetchCaseSuspectsLookup(caseId);
      setSuspects(suspectsData);
    } catch (err: unknown) {
      console.error('Error al sincronizar sospechosos del caso:', err);
    }
  }, [caseId]);

  const loadData = useCallback(async () => {
    if (!caseId) return;
    setIsLoading(true);
    setError(null);

    try {
      const [evidencesData, suspectsData] = await Promise.all([
        evidencesService.listByCase(caseId),
        fetchCaseSuspectsLookup(caseId),
      ]);
      setEvidences(evidencesData);
      setSuspects(suspectsData);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(
        apiErr.message ||
          'No fue posible cargar el registro de evidencias para este caso criminal.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sincronizar automáticamente cuando se añade, actualiza o elimina un sospechoso en la vista
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleSuspectsChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ caseId?: string }>;
      if (!customEvent.detail?.caseId || customEvent.detail.caseId === caseId) {
        loadSuspects();
      }
    };

    window.addEventListener('suspects:changed', handleSuspectsChanged);
    return () => {
      window.removeEventListener('suspects:changed', handleSuspectsChanged);
    };
  }, [caseId, loadSuspects]);

  const createEvidence = async (payload: Omit<CreateEvidencePayload, 'caseId'>) => {
    const created = await evidencesService.create({
      ...payload,
      caseId,
    });
    setEvidences((prev) => [created, ...prev]);
    return created;
  };

  const updateEvidence = async (id: string, payload: UpdateEvidencePayload) => {
    const updated = await evidencesService.update(id, payload);
    setEvidences((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const deleteEvidence = async (id: string) => {
    await evidencesService.remove(id);
    setEvidences((prev) => prev.filter((e) => e.id !== id));
  };

  return {
    evidences,
    suspects,
    isLoading,
    error,
    refresh: loadData,
    refreshSuspects: loadSuspects,
    createEvidence,
    updateEvidence,
    deleteEvidence,
  };
}
