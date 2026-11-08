'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../src/features/auth';
import { Input, Button, Spinner } from '../../src/features/common/components';
import { ApiError } from '../../src/features/common/domain/api-error';

function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expiredNotice, setExpiredNotice] = useState<boolean>(false);

  useEffect(() => {
    if (searchParams.get('expired') === '1') {
      setExpiredNotice(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setExpiredNotice(false);

    if (!email || !password) {
      setErrorMessage('Por favor ingrese su correo electrónico y contraseña');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (err) {
      const apiErr = err as ApiError;
      setErrorMessage(
        apiErr.message || 'No fue posible iniciar sesión. Verifique sus credenciales.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-md border border-grafito-light bg-grafito p-8 shadow-2xl relative">
        {/* Marca de expediente confidencial */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-grafito-light">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-alerta">
              SEGURIDAD FORENSE
            </span>
            <h1 className="font-serif text-xl tracking-wide text-papel mt-1">
              Acceso a Expedientes
            </h1>
          </div>
          <span className="font-mono text-xs text-papel-muted">AUTH-01</span>
        </div>

        {expiredNotice && (
          <div className="mb-4 p-3 bg-alerta/10 border border-alerta/40 text-alerta text-xs font-mono">
            [AVISO]: Su sesión previa ha expirado o el token no es válido. Por favor ingrese de
            nuevo.
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-evidencia/10 border border-evidencia/60 text-evidencia text-xs font-mono">
            [ERROR]: {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Correo Electrónico del Investigador"
            type="email"
            placeholder="detective@forense.test"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />

          <Input
            label="Contraseña de Acceso"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full font-mono uppercase tracking-wider py-2.5 text-xs"
              loading={isLoading}
            >
              AUTENTICAR IDENTIDAD
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-grafito-light text-center">
          <p className="text-xs text-papel-muted">
            ¿No dispone de acreditación en el sistema?{' '}
            <Link
              href="/register"
              className="text-papel underline hover:text-alerta transition-colors ml-1 font-mono"
            >
              Registrar nuevo detective
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md border border-grafito-light bg-grafito p-8 shadow-2xl flex justify-center">
            <Spinner />
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
