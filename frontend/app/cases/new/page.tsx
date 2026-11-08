'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, FolderPlus } from 'lucide-react';
import { CaseForm } from '../../../src/features/cases';
import { Spinner } from '../../../src/features/common/components';

export default function NewCasePage() {
  return (
    <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
      {/* Navegación y título */}
      <div className="space-y-2 pb-4 border-b border-grafito-light">
        <Link
          href="/cases"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-alerta hover:text-alerta-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLVER AL LISTADO DE EXPEDIENTES</span>
        </Link>
        <div className="flex items-center gap-3">
          <FolderPlus className="w-6 h-6 text-alerta shrink-0" />
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-alerta">
              REGISTRO DE NUEVA INVESTIGACIÓN
            </span>
            <h1 className="font-serif text-2xl text-papel mt-0.5">
              Apertura de Expediente Criminal
            </h1>
          </div>
        </div>
      </div>

      <Suspense fallback={<Spinner className="w-8 h-8 mx-auto" />}>
        <CaseForm isEditing={false} />
      </Suspense>
    </div>
  );
}
