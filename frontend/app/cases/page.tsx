'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAuth } from '../../src/features/auth';
import { CasesList } from '../../src/features/cases';
import { Button, Spinner } from '../../src/features/common/components';

export default function CasesPage() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
      {/* Cabecera provisional que conserva cerrar sesión y panel admin hasta entrega de Navbar por D */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-grafito-light">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-alerta">
            ARCHIVO GENERAL DE INVESTIGACIONES FORENSES
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-papel mt-1">
            Expedientes Criminales
          </h1>
          <p className="text-xs font-mono text-papel-muted mt-0.5">
            Agente en servicio: <strong className="text-papel">{user?.name}</strong> [{user?.role}]
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <Link href="/cases/new">
            <Button variant="primary" className="inline-flex items-center gap-2 text-xs">
              <Plus className="w-4 h-4" />
              <span>NUEVO EXPEDIENTE</span>
            </Button>
          </Link>
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="px-3 py-2 text-xs font-mono uppercase bg-grafito border border-grafito-light text-papel hover:bg-grafito-light transition-colors"
            >
              PANEL ADMIN
            </Link>
          )}
          <Button variant="ghost" onClick={logout} className="text-xs font-mono">
            CERRAR SESIÓN
          </Button>
        </div>
      </div>

      {/* Listado central de casos */}
      <Suspense fallback={<Spinner className="w-8 h-8 mx-auto" />}>
        <CasesList />
      </Suspense>
    </div>
  );
}
