'use client';

import React, { useState } from 'react';
import { FileSearch, Plus, Lock, Layers, AlertCircle } from 'lucide-react';
import { useEvidences } from '../hooks/use-evidences';
import { Evidence } from '../domain/evidence';
import { EvidenceCard } from './EvidenceCard';
import { EvidenceFormModal } from './EvidenceFormModal';
import { Button, Spinner, EmptyState, ErrorState, ConfirmDialog } from '../../common/components';
import { CreateEvidencePayload, UpdateEvidencePayload } from '../services/evidences.service';

export interface EvidencesSectionProps {
  caseId: string;
  isCaseClosed: boolean;
}

export const EvidencesSection: React.FC<EvidencesSectionProps> = ({ caseId, isCaseClosed }) => {
  const {
    evidences,
    suspects,
    isLoading,
    error,
    refresh,
    createEvidence,
    updateEvidence,
    deleteEvidence,
  } = useEvidences(caseId);

  // Estados de modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState<Evidence | null>(null);

  // Estados de diálogo de confirmación de borrado
  const [evidenceToDelete, setEvidenceToDelete] = useState<Evidence | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleOpenCreate = () => {
    if (isCaseClosed) return;
    setEditingEvidence(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (evidence: Evidence) => {
    setEditingEvidence(evidence);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (
    data: Omit<CreateEvidencePayload, 'caseId'> | UpdateEvidencePayload,
  ) => {
    if (editingEvidence) {
      await updateEvidence(editingEvidence.id, data);
    } else {
      await createEvidence(data as Omit<CreateEvidencePayload, 'caseId'>);
    }
  };

  const handleConfirmDelete = async () => {
    if (!evidenceToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteEvidence(evidenceToDelete.id);
      setEvidenceToDelete(null);
    } catch (err: unknown) {
      setDeleteError(
        err instanceof Error ? err.message : 'No fue posible eliminar la evidencia seleccionada.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section
      aria-labelledby="evidences-section-title"
      className="border border-grafito-light bg-grafito p-6 shadow-xl space-y-6 relative"
    >
      {/* Cabecera de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-grafito-light">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-grafito-dark border border-grafito-light flex items-center justify-center text-alerta">
            <FileSearch className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 id="evidences-section-title" className="font-serif text-lg sm:text-xl text-papel">
                Evidencias y Elementos Materiales Probatorios
              </h3>
              <span className="font-mono text-xs font-bold text-alerta bg-grafito-dark px-2 py-0.5 border border-grafito-light">
                {evidences.length}
              </span>
            </div>
            <p className="text-xs font-mono text-papel-muted mt-0.5">
              CADENA DE CUSTODIA &bull; REGISTRO FOTOGRÁFICO Y PERICIAL
            </p>
          </div>
        </div>

        {/* Botón de fijación de evidencia */}
        <div>
          <Button
            variant="primary"
            onClick={handleOpenCreate}
            disabled={isCaseClosed}
            title={
              isCaseClosed
                ? 'El caso está cerrado: no se permite registrar nuevas evidencias'
                : 'Fijar nueva evidencia'
            }
            className="inline-flex items-center gap-1.5 text-xs w-full sm:w-auto"
          >
            {isCaseClosed ? (
              <>
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>CASO CERRADO</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>+ NUEVA EVIDENCIA</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Alerta si el caso está cerrado */}
      {isCaseClosed && (
        <div
          role="status"
          className="flex items-start gap-2.5 p-3.5 border border-alerta/40 bg-alerta/10 text-papel font-mono text-xs"
        >
          <Lock className="w-4 h-4 text-alerta shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong className="text-alerta uppercase">
              [REGISTRO BLOQUEADO POR CASO CERRADO &bull; REGLA 3]
            </strong>
            <p className="mt-0.5 text-papel-dark leading-relaxed font-sans">
              No es posible incorporar nuevas evidencias a una investigación archivada o concluida.
              Sin embargo, las evidencias existentes pueden ser consultadas, modificadas o
              eliminadas conforme a las normas procesales del sistema.
            </p>
          </div>
        </div>
      )}

      {/* Error de borrado si ocurre */}
      {deleteError && (
        <div
          role="alert"
          className="flex items-center gap-2 p-3 border border-evidencia bg-evidencia/10 text-evidencia font-mono text-xs"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{deleteError}</span>
        </div>
      )}

      {/* Contenido según el estado */}
      {isLoading ? (
        <div className="py-12">
          <Spinner className="w-8 h-8" />
          <p className="text-center font-mono text-xs text-papel-muted mt-2">
            RECUPERANDO CADENA DE CUSTODIA Y EVIDENCIAS...
          </p>
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : evidences.length === 0 ? (
        <EmptyState
          title="No se han registrado evidencias materiales en este expediente"
          description="Fije huellas dactilares, casquillos, informes balísticos, registros fotográficos o documentos probatorios para sustentar la investigación."
          action={
            !isCaseClosed ? (
              <Button
                variant="secondary"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-1.5 text-xs"
              >
                <Plus className="w-3.5 h-3.5 text-alerta" aria-hidden="true" />
                <span>FIJAR PRIMERA EVIDENCIA</span>
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evidences.map((evidence) => (
            <EvidenceCard
              key={evidence.id}
              evidence={evidence}
              suspects={suspects}
              onEdit={handleOpenEdit}
              onDelete={(e) => setEvidenceToDelete(e)}
            />
          ))}
        </div>
      )}

      {/* Modal para crear o editar evidencia */}
      {isFormOpen && (
        <EvidenceFormModal
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          caseId={caseId}
          initialData={editingEvidence}
          suspects={suspects}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Diálogo de confirmación para eliminar evidencia */}
      {evidenceToDelete && (
        <ConfirmDialog
          open={Boolean(evidenceToDelete)}
          title="CONFIRMAR ELIMINACIÓN DE EVIDENCIA"
          message={`¿Confirma la desactivación forense de la evidencia "${evidenceToDelete.title}"? Esta acción removerá la pieza de la cadena de custodia activa.`}
          confirmLabel="ELIMINAR EVIDENCIA"
          loading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            if (!isDeleting) setEvidenceToDelete(null);
          }}
        />
      )}
    </section>
  );
};
