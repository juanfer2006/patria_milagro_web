'use client';

import React, { useState } from 'react';
import { Users, UserPlus, Search, AlertCircle } from 'lucide-react';
import { useSuspects } from '../hooks/use-suspects';
import {
  Suspect,
  SuspectStatus,
  CreateSuspectInput,
  UpdateSuspectInput,
  SUSPECT_STATUS_LABELS,
} from '../domain/suspect';
import { SuspectCard } from './SuspectCard';
import { SuspectFormModal } from './SuspectFormModal';
import {
  Button,
  Spinner,
  EmptyState,
  ErrorState,
  ConfirmDialog,
  Pagination,
} from '../../common/components';

export interface SuspectsSectionProps {
  caseId: string;
  isCaseClosed: boolean;
}

export const SuspectsSection: React.FC<SuspectsSectionProps> = ({ caseId, isCaseClosed }) => {
  const {
    suspects,
    pagination,
    isLoading,
    error,
    refresh,
    goToPage,
    createSuspect,
    updateSuspect,
    deleteSuspect,
    filters,
    setFilters,
  } = useSuspects(caseId);

  const [modalOpen, setModalOpen] = useState(false);
  const [suspectToEdit, setSuspectToEdit] = useState<Suspect | null>(null);

  const [suspectToDelete, setSuspectToDelete] = useState<Suspect | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const handleOpenCreate = () => {
    setSuspectToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (suspect: Suspect) => {
    setSuspectToEdit(suspect);
    setModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateSuspectInput | UpdateSuspectInput) => {
    if (suspectToEdit) {
      await updateSuspect(suspectToEdit.id, data as UpdateSuspectInput);
    } else {
      await createSuspect(data as CreateSuspectInput);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!suspectToDelete) return;
    try {
      setIsDeleting(true);
      await deleteSuspect(suspectToDelete.id);
      setSuspectToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFilterApply = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({
      caseId,
      q: searchTerm.trim() ? searchTerm.trim() : undefined,
      status: selectedStatus ? (selectedStatus as SuspectStatus) : undefined,
    });
  };

  return (
    <div className="border border-grafito-light bg-grafito p-6 shadow-2xl space-y-6">
      {/* Cabecera de la sección */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-grafito-light">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-grafito-dark border border-grafito-light">
            <Users className="w-5 h-5 text-alerta" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg text-papel tracking-wide">
                Personas de Interés y Sospechosos
              </h3>
              <span className="font-mono text-xs px-2 py-0.5 bg-grafito-dark text-papel-muted border border-grafito-light">
                {pagination.total}
              </span>
            </div>
            <p className="text-xs text-papel-muted font-sans mt-0.5">
              Control de identidades, nivel de sospecha y estado procesal
            </p>
          </div>
        </div>

        {/* Botón para registrar nuevo sospechoso */}
        <div>
          {isCaseClosed ? (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 border border-alerta/40 bg-alerta/10 text-alerta text-xs font-mono select-none"
              title="El caso se encuentra cerrado. No se permite agregar nuevos sospechosos (Regla 3)."
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>CASO CERRADO: REGISTRO BLOQUEADO</span>
            </div>
          ) : (
            <Button
              variant="primary"
              onClick={handleOpenCreate}
              className="text-xs py-2 px-3.5 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>VINCULAR SOSPECHOSO</span>
            </Button>
          )}
        </div>
      </div>

      {/* Barra de filtros (q y status) */}
      <form onSubmit={handleFilterApply} className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-papel-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o alias..."
            className="w-full bg-grafito-dark border border-grafito-light text-papel text-xs pl-9 pr-3 py-2 placeholder:text-papel-muted/50 focus:outline-none focus:ring-1 focus:ring-alerta"
            aria-label="Buscar sospechosos por nombre o alias"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-grafito-dark border border-grafito-light text-papel text-xs px-3 py-2 focus:outline-none focus:ring-1 focus:ring-alerta"
          aria-label="Filtrar por estado procesal"
        >
          <option value="">Todos los estados</option>
          {Object.entries(SUSPECT_STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>

        <Button type="submit" variant="secondary" className="text-xs py-2 px-3">
          FILTRAR
        </Button>
      </form>

      {/* Contenido condicional: Cargando, Error, Vacío o Lista */}
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : suspects.length === 0 ? (
        <EmptyState
          title="No hay personas de interés o sospechosos registrados"
          description={
            isCaseClosed
              ? 'El expediente está cerrado y no se vincularon personas de interés.'
              : 'Utilice el botón de vincular sospechoso para registrar la primera persona investigada.'
          }
          action={
            !isCaseClosed && (
              <Button variant="secondary" onClick={handleOpenCreate} className="text-xs">
                Vincular primer sospechoso
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suspects.map((suspect) => (
              <SuspectCard
                key={suspect.id}
                suspect={suspect}
                onEdit={handleOpenEdit}
                onDelete={(s) => setSuspectToDelete(s)}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pt-2">
              <Pagination
                page={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={goToPage}
              />
            </div>
          )}
        </div>
      )}

      {/* Modal de formulario para crear/editar */}
      <SuspectFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        caseId={caseId}
        suspectToEdit={suspectToEdit}
        onSubmit={handleFormSubmit}
      />

      {/* Confirmación para eliminar sospechoso */}
      <ConfirmDialog
        open={Boolean(suspectToDelete)}
        title="CONFIRMAR ELIMINACIÓN DE SOSPECHOSO"
        message={`¿Confirma que desea desvincular a "${suspectToDelete?.fullName}" (${
          suspectToDelete?.alias ? `alias "${suspectToDelete.alias}"` : 'sin alias'
        }) de este expediente? La ficha del sospechoso será desactivada y sus evidencias vinculadas quedarán en el expediente sin sospechoso asignado.`}
        confirmLabel="DESVINCULAR SOSPECHOSO"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setSuspectToDelete(null)}
      />
    </div>
  );
};
