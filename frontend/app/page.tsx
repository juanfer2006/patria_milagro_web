'use client';

import Link from 'next/link';
import { useAuth } from '../src/features/auth';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="max-w-xl w-full border border-grafito-light bg-grafito p-8 shadow-2xl relative space-y-6">
        <div className="border-b border-grafito-light pb-4">
          <span className="text-[10px] font-mono tracking-widest uppercase text-alerta">
            SISTEMA DE INVESTIGACIÓN CRIMINAL &mdash; PARADIGMAS & WEB
          </span>
          <h1 className="font-serif text-3xl text-papel mt-2 tracking-wide">
            Expediente Forense Noir
          </h1>
          <p className="text-xs font-mono text-papel-muted mt-1">
            ESTACIÓN CENTRAL DE INVESTIGACIÓN POLICIAL FICTICIA
          </p>
        </div>

        <p className="text-sm text-papel-dark leading-relaxed">
          Plataforma centralizada para la gestión de casos criminales, control de sospechosos,
          fijación de evidencias fotográficas y peritajes forenses.
        </p>

        <div className="p-4 bg-grafito-dark border border-grafito-light space-y-2">
          <p className="text-xs font-mono text-papel-muted uppercase">ESTADO DE SESIÓN</p>
          {isAuthenticated ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-papel font-medium">{user?.name}</p>
                <p className="text-xs font-mono text-alerta">ROL: {user?.role}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/cases"
                  className="px-4 py-2 font-mono text-xs uppercase bg-evidencia hover:bg-evidencia-hover text-white transition-colors"
                >
                  IR A CASOS &rarr;
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 font-mono text-xs uppercase bg-grafito-light hover:bg-papel hover:text-tinta text-papel transition-colors"
                  >
                    PANEL ADMIN
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/login"
                className="flex-1 text-center py-2.5 font-mono text-xs uppercase bg-evidencia hover:bg-evidencia-hover text-white transition-colors"
              >
                INGRESAR AL SISTEMA
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2.5 font-mono text-xs uppercase bg-grafito-light hover:bg-papel hover:text-tinta text-papel border border-grafito-light transition-colors"
              >
                REGISTRO NUEVO
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
