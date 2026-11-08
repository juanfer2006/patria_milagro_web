'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { useCase, CaseForm, formatCaseCode } from '../../../../src/features/cases';
import { Spinner, ErrorState } from '../../../../src/features/common/components';

interface EditCasePageProps {
  params: {
    id: string;
  };
}

export default function EditCasePage({ params }: EditCasePageProps) {
  const { caseData, isLoading, error, isNotFound, refetch } = useCase(params.id);

  if (isNotFound) {
    notFound();
  }

  return (
    <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
      <div className="space-y-2 pb-4 border-b border-grafito-light">
        <Link
          href={`/cases/${params.id}`}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-alerta hover:text-alerta-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLVER AL EXPEDIENTE</span>
        </Link>
        <div className="flex items-center gap-3">
          <Edit3 className="w-6 h-6 text-alerta shrink-0" />
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-alerta">
              MODIFICACIÓN DE EXPEDIENTE {caseData ? formatCaseCode(caseData.caseNumber) : ''}
            </span>
            <h1 className="font-serif text-2xl text-papel mt-0.5">Editar Caso Forense</h1>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 border border-grafito-light bg-grafito text-center">
          <Spinner className="w-8 h-8 mx-auto" />
          <p className="font-mono text-xs text-papel-muted mt-2 tracking-wider">
            RECUPERANDO DATOS DEL EXPEDIENTE...
          </p>
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : caseData ? (
        <CaseForm initialCase={caseData} isEditing={true} />
      ) : null}
    </div>
  );
}
