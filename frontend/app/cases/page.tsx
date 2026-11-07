'use client';

import Link from 'next/link';
import { useAuth } from '../../src/features/auth';
import { Button } from '../../src/features/common/components';

export default function CasesPage() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-5xl w-full mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-grafito-light">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-alerta">
            MÓDULO DE CASOS
          </span>
          <h1 className="font-serif text-2xl text-papel mt-1">Expedientes en Curso</h1>
          <p className="text-xs font-mono text-papel-muted">
            Sesión activa: {user?.name} ({user?.role})
          </p>
        </div>
        <div className="flex items-center gap-3">
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

      <div className="border border-dashed border-grafito-light bg-grafito p-8 text-center space-y-3">
        <span className="text-xs font-mono uppercase text-alerta">[REBANADA B EN DESARROLLO]</span>
        <h2 className="font-serif text-lg text-papel">Listado de Casos e Investigaciones</h2>
        <p className="text-xs text-papel-muted max-w-md mx-auto">
          Esta vista está reservada para el Integrante B (Casos e Imágenes). La autenticación,
          protección de rutas y sesión persistente provistas por la Fundación (Integrante A) están
          completamente operativas.
        </p>
      </div>
    </div>
  );
}
