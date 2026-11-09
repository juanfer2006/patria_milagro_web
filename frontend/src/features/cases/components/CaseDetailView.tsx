'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Users,
  Lock,
} from 'lucide-react';
import { Case, formatCaseCode } from '../domain/case';
import { casesService } from '../services/cases.service';
import { CaseStatusBadge } from './CaseStatusBadge';
import { ConfirmDialog, Button, ErrorState } from '../../common/components';
import { EvidencesSection } from '../../evidences';

export interface CaseDetailViewProps {
  caseData: Case;
}

// Marcador local para SuspectsSection (Rebanada C) con contrato idéntico { caseId, isCaseClosed }
export const SuspectsSectionPlaceholder: React.FC<{
  caseId: string;
  isCaseClosed: boolean;
}> = ({ caseId: _caseId, isCaseClosed }) => (
  <div className="border border-dashed border-grafito-light bg-grafito p-6 space-y-3">
    <div className="flex items-center justify-between pb-2 border-b border-grafito-light">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-alerta" />
        <h3 className="font-serif text-lg text-papel">Personas de Interés y Sospechosos</h3>
      </div>
      <span className="font-mono text-[10px] text-alerta uppercase tracking-widest">
        [REBANADA C EN DESARROLLO]
      </span>
    </div>
    <p className="text-xs text-papel-muted leading-relaxed">
      Esta sección listará los sospechosos vinculados a este expediente y permitirá asociar nivel
      de sospecha (0-100) y fotografía.
      {isCaseClosed && (
        <span className="block text-evidencia mt-1 font-mono">
          * El expediente está cerrado: la adición de nuevos sospechosos está deshabilitada (Regla 3).
        </span>
      )}
    </p>
  </div>
);

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({ caseData }) => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isCaseClosed = caseData.status === 'CLOSED';

  const formattedDate = new Date(caseData.incidentDate).toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await casesService.remove(caseData.id);
      router.push('/cases');
    } catch (err: unknown) {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteError(
        err instanceof Error ? err.message : 'No fue posible eliminar el expediente criminal',
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Navegación y acciones principales */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-grafito-light">
        <Link
          href="/cases"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-alerta hover:text-alerta-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLVER AL LISTADO DE EXPEDIENTES</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href={`/cases/${caseData.id}/edit`}>
            <Button variant="secondary" className="inline-flex items-center gap-1.5 text-xs">
              <Edit className="w-3.5 h-3.5" />
              <span>EDITAR EXPEDIENTE</span>
            </Button>
          </Link>
          <Button
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-1.5 text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ELIMINAR</span>
          </Button>
        </div>
      </div>

      {deleteError && <ErrorState message={deleteError} />}

      {/* Aviso de caso cerrado si aplica */}
      {isCaseClosed && (
        <div
          role="status"
          className="flex items-center gap-3 p-4 border border-alerta/50 bg-alerta/10 text-papel font-mono text-xs"
        >
          <Lock className="w-5 h-5 text-alerta shrink-0" />
          <div>
            <strong className="text-alerta tracking-wider uppercase">[EXPEDIENTE CERRADO]</strong>
            <p className="mt-0.5 text-papel-dark">
              Esta investigación se encuentra formalmente concluida. Se permite su reapertura o
              edición, pero no se pueden anexar nuevos sospechosos ni evidencias conforme a la Regla de Negocio 3.
            </p>
          </div>
        </div>
      )}

      {/* Cabecera del expediente criminal tipo expediente noir */}
      <section className="relative border border-grafito-light bg-grafito p-6 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-alerta tracking-widest px-2.5 py-1 bg-grafito-dark border border-grafito-light">
              {formatCaseCode(caseData.caseNumber)}
            </span>
            <CaseStatusBadge status={caseData.status} />
          </div>

          <span className="font-serif text-xs uppercase tracking-widest text-evidencia border border-evidencia/60 px-3 py-1 transform -rotate-1 select-none shadow">
            CONFIDENCIAL // USO OFICIAL
          </span>
        </div>

        <div>
          <h1 className="font-serif text-2xl sm:text-4xl text-papel leading-tight">
            {caseData.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-mono text-papel-muted">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-alerta shrink-0" />
              <span>{caseData.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-papel-muted shrink-0" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Fotografía de la escena / archivo adjunto */}
        {caseData.imageUrl && (
          <div className="space-y-2">
            <span className="block font-mono text-[10px] text-papel-muted uppercase tracking-widest">
              REGISTRO FOTOGRÁFICO DE LA ESCENA // ARCHIVO DE EVIDENCIA
            </span>
            <div className="relative w-full h-64 sm:h-96 border border-grafito-light bg-grafito-dark overflow-hidden group">
              <Image
                src={caseData.imageUrl}
                alt={caseData.title}
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute top-3 left-0 bg-alerta text-tinta font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-lg">
                CINTA FORENSE // EVIDENCIA PRINCIPAL
              </div>
            </div>
          </div>
        )}

        {/* Descripción de los hechos */}
        <div className="space-y-2 pt-2 border-t border-grafito-light/60">
          <h2 className="font-mono text-xs uppercase tracking-widest text-papel-dark font-semibold">
            DESCRIPCIÓN MINUCIOSA DE LOS HECHOS
          </h2>
          <div className="p-4 bg-grafito-dark/60 border border-grafito-light font-sans text-sm text-papel-dark leading-relaxed whitespace-pre-wrap">
            {caseData.description}
          </div>
        </div>
      </section>

      {/* Secciones vinculadas: Sospechosos (C) y Evidencias (D) */}
      <section className="space-y-6 pt-4">
        <SuspectsSectionPlaceholder caseId={caseData.id} isCaseClosed={isCaseClosed} />
        <EvidencesSection caseId={caseData.id} isCaseClosed={isCaseClosed} />
      </section>

      {/* Diálogo de confirmación de eliminación con borrado en cascada */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="CONFIRMAR ELIMINACIÓN DE CASO"
        message={`¿Confirma la eliminación definitiva del caso "${caseData.title}" (${formatCaseCode(
          caseData.caseNumber,
        )})? Esta acción desactivará el registro y todos sus sospechosos y evidencias asociadas.`}
        confirmLabel="ELIMINAR EXPEDIENTE"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};
