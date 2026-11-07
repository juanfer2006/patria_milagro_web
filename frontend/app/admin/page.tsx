'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../src/features/auth';
import { useAdminUsers } from '../../src/features/admin';
import {
  Input,
  Select,
  Button,
  Pagination,
  ConfirmDialog,
  Spinner,
  EmptyState,
  ErrorState,
} from '../../src/features/common/components';

export default function AdminPage() {
  const { user: currentUser, logout } = useAuth();
  const {
    users,
    pagination,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    deactivateUser,
    refresh,
  } = useAdminUsers();

  const [selectedUserToDeactivate, setSelectedUserToDeactivate] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleConfirmDeactivate = async () => {
    if (!selectedUserToDeactivate) return;

    setIsDeactivating(true);
    setActionError(null);
    try {
      await deactivateUser(selectedUserToDeactivate.id);
      setSelectedUserToDeactivate(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error al desactivar el usuario');
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto p-6 space-y-6">
      {/* Cabecera del panel de administración */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-grafito-light gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest uppercase bg-evidencia/20 text-evidencia px-2 py-0.5 border border-evidencia/40">
              NIVEL DE ACCESO: ADMINISTRADOR
            </span>
            <span className="text-xs font-mono text-papel-muted">ADM-PANEL</span>
          </div>
          <h1 className="font-serif text-2xl text-papel mt-1">
            Gestión y Control de Personal Forense
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cases"
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-grafito border border-grafito-light text-papel hover:bg-grafito-light transition-colors"
          >
            VER TODOS LOS CASOS &rarr;
          </Link>
          <Button variant="ghost" onClick={logout} className="text-xs font-mono">
            CERRAR SESIÓN
          </Button>
        </div>
      </div>

      {actionError && (
        <div className="p-3 bg-evidencia/10 border border-evidencia text-evidencia text-xs font-mono">
          [ERROR EN OPERACIÓN]: {actionError}
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-grafito p-4 border border-grafito-light">
        <div className="sm:col-span-2">
          <Input
            label="Búsqueda por nombre o correo"
            placeholder="Buscar por nombre o correo..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div>
          <Select
            label="Filtrar por Rol"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">TODOS LOS ROLES</option>
            <option value="ADMIN">ADMINISTRADOR</option>
            <option value="USER">USUARIO / DETECTIVE</option>
          </Select>
        </div>
      </div>

      {/* Contenido de la Tabla */}
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : users.length === 0 ? (
        <EmptyState
          title="No se encontraron usuarios"
          description="No existen investigadores que coincidan con los criterios de búsqueda aplicados."
        />
      ) : (
        <div className="border border-grafito-light bg-grafito overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-grafito-light bg-grafito-dark font-mono text-[11px] text-papel-muted uppercase tracking-wider">
                  <th className="py-3 px-4">INVESTIGADOR</th>
                  <th className="py-3 px-4">CORREO INSTITUCIONAL</th>
                  <th className="py-3 px-4">ROL</th>
                  <th className="py-3 px-4">FECHA DE ALTA</th>
                  <th className="py-3 px-4 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grafito-light font-sans text-xs">
                {users.map((u) => {
                  const isSelf = currentUser?.id === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-grafito-light/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-papel">
                        {u.name}
                        {isSelf && (
                          <span className="ml-2 font-mono text-[10px] text-alerta uppercase">
                            (USTED)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-papel-dark font-mono">{u.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 border ${
                            u.role === 'ADMIN'
                              ? 'bg-alerta/10 border-alerta text-alerta'
                              : 'bg-grafito-dark border-grafito-light text-papel-muted'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-papel-muted font-mono">
                        {new Date(u.createdAt).toLocaleDateString('es-CO')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="danger"
                          className="text-[11px] py-1 px-3"
                          disabled={isSelf}
                          title={
                            isSelf
                              ? 'No está permitido desactivar su propia cuenta'
                              : 'Desactivar usuario'
                          }
                          onClick={() => setSelectedUserToDeactivate({ id: u.id, name: u.name })}
                        >
                          DESACTIVAR
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-grafito-dark">
            <Pagination
              page={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>
        </div>
      )}

      {/* ConfirmDialog de confirmación para desactivación (Regla 9) */}
      <ConfirmDialog
        open={!!selectedUserToDeactivate}
        title="CONFIRMAR DESACTIVACIÓN DE USUARIO"
        message={`¿Está seguro de que desea revocar el acceso del investigador "${selectedUserToDeactivate?.name}"? Esta acción marcará su cuenta como INACTIVA y no podrá volver a iniciar sesión.`}
        confirmLabel="PROCEDER CON DESACTIVACIÓN"
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setSelectedUserToDeactivate(null)}
        loading={isDeactivating}
      />
    </div>
  );
}
