'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../src/features/auth';
import { Input, Button } from '../../src/features/common/components';
import { ApiError } from '../../src/features/common/domain/api-error';

export default function RegisterPage() {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (!name || !email || !password) {
      setErrorMessage('Todos los campos son obligatorios');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('La contraseña debe contener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, email, password });
    } catch (err) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'No fue posible completar el registro del investigador.');

      if (apiErr.details && Array.isArray(apiErr.details)) {
        const errorsMap: Record<string, string> = {};
        apiErr.details.forEach((d) => {
          if (d.field) {
            // Eliminar prefijo body. si existe
            const cleanField = d.field.replace(/^body\./, '');
            errorsMap[cleanField] = d.message;
          }
        });
        setFieldErrors(errorsMap);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-md border border-grafito-light bg-grafito p-8 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-grafito-light">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-alerta">
              REGISTRO DE PERSONAL
            </span>
            <h1 className="font-serif text-xl tracking-wide text-papel mt-1">
              Alta de Investigador
            </h1>
          </div>
          <span className="font-mono text-xs text-papel-muted">AUTH-02</span>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-evidencia/10 border border-evidencia/60 text-evidencia text-xs font-mono">
            [ERROR]: {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre Completo del Investigador"
            type="text"
            placeholder="Ej: Detective Inspector Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            error={fieldErrors['name']}
            required
          />

          <Input
            label="Correo Electrónico Institucional"
            type="email"
            placeholder="investigador@forense.test"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            error={fieldErrors['email']}
            required
          />

          <Input
            label="Contraseña (Mínimo 8 caracteres, letras y números)"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            error={fieldErrors['password']}
            hint="Debe contener al menos una letra y un número"
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full font-mono uppercase tracking-wider py-2.5 text-xs"
              loading={isLoading}
            >
              REGISTRAR CREDENCIALES
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-grafito-light text-center">
          <p className="text-xs text-papel-muted">
            ¿Ya posee una credencial asignada?{' '}
            <Link
              href="/login"
              className="text-papel underline hover:text-alerta transition-colors ml-1 font-mono"
            >
              Iniciar sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
