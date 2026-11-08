'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Case } from '../domain/case';
import { useCases } from '../hooks/use-cases';
import { CaseCard } from './CaseCard';
import { CaseFilters } from './CaseFilters';
import {
  Pagination,
  Spinner,
  EmptyState,
  ErrorState,
  ConfirmDialog,
  Button,
} from '../../common/components';

export interface CasesListProps {
  ownerId?: string;
  className?: string;
}

export const CasesList: React.FC<CasesListProps> = ({ ownerId, className = '' }) => {
  const {
    cases,
    pagination,
    isLoading,
    error,
    page: _page,
    setPage,
    filters,
    setFilter,
    resetFilters,
    refetch,
    removeCase,
  } = useCases(ownerId);

  const [caseToDelete, setCaseToDelete] = useState<Case | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDeleteConfirm = async () => {
    if (!caseToDelete) return;
    setIsDeleting(true);
    const success = await removeCase(caseToDelete.id);
    setIsDeleting(false);
    if (success) {
      setCaseToDelete(null);
    }
  };

  const hasActiveFilters = Boolean(filters.q || filters.status || filters.from || filters.to);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Controles de filtro */}
      <CaseFilters filters={filters} onFilterChange={setFilter} onReset={resetFilters} />

      {/* Manejo de estados: Cargando / Error / Vacío / Listado */}
      {isLoading ? (
        <div className="py-12 border border-grafito-light bg-grafito">
          <Spinner className="w-8 h-8" />
          <p className="text-center font-mono text-xs text-papel-muted mt-2 tracking-wider">
            CONSULTANDO ARCHIVO DE INVESTIGACIONES...
          </p>
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : cases.length === 0 ? (
        <EmptyState
          title={
            hasActiveFilters
              ? 'No hay casos que coincidan con los filtros'
              : 'No hay investigaciones registradas'
          }
          description={
            hasActiveFilters
              ? 'Intente modificar o limpiar los criterios de búsqueda para visualizar otros expedientes.'
              : 'Comience registrando un nuevo caso criminal en el sistema para iniciar la investigación.'
          }
          action={
            hasActiveFilters ? (
              <Button variant="secondary" onClick={resetFilters}>
                LIMPIAR FILTROS
              </Button>
            ) : (
              <Link href="/cases/new">
                <Button variant="primary" className="inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>REGISTRAR NUEVO CASO</span>
                </Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((item) => (
              <CaseCard key={item.id} caseItem={item} onDeleteRequest={(c) => setCaseToDelete(c)} />
            ))}
          </div>

          {/* Paginación */}
          <Pagination
            page={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Cuadro de confirmación de eliminación con borrado lógico en cascada */}
      <ConfirmDialog
        open={Boolean(caseToDelete)}
        title="CONFIRMAR ELIMINACIÓN DE EXPEDIENTE"
        message={`¿Está seguro de que desea eliminar el caso "${caseToDelete?.title}"? Esta acción desactivará el expediente y todos los sospechosos y evidencias asociados.`}
        confirmLabel="ELIMINAR EXPEDIENTE"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCaseToDelete(null)}
      />
    </div>
  );
};
