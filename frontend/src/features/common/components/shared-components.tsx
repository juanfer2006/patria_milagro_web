'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from './Button';

// Re-export D's base components for backward compatibility
export * from './Button';
export * from './Input';
export * from './Select';
export * from './Textarea';
export * from './FormField';
export * from './Pagination';
export * from './ThemeToggle';
export * from './Navbar';
export * from './Footer';

// =======================================================================
// Componentes de Retroalimentación y Diálogos (Rebanada C)
// =======================================================================

// Modal
export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, title, onClose, children }) => {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tinta/80 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg border border-grafito-light bg-grafito p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-grafito-light">
          <h3 className="text-base font-serif tracking-wider text-papel">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-papel-muted hover:text-papel font-mono text-sm p-1 focus:outline-none focus:ring-1 focus:ring-alerta"
            aria-label="Cerrar ventana modal"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

// ConfirmDialog
export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'CONFIRMAR',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!open) return null;
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-sm text-papel-dark mb-6 leading-relaxed font-sans">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          CANCELAR
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};

// Spinner
export const Spinner: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <div className="flex justify-center items-center p-4" role="status" aria-label="Cargando">
    <Loader2 className={`animate-spin text-alerta ${className}`} aria-hidden="true" />
    <span className="sr-only">Cargando...</span>
  </div>
);

// EmptyState
export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-grafito-light bg-grafito-dark/50">
    <span className="font-mono text-xs uppercase tracking-widest text-alerta mb-2 select-none">
      [EXPEDIENTE VACÍO]
    </span>
    <h4 className="text-base font-serif text-papel">{title}</h4>
    {description && <p className="text-xs text-papel-muted mt-1 max-w-sm">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

// ErrorState
export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div role="alert" className="p-4 border border-evidencia/60 bg-evidencia/10 text-papel space-y-2">
    <p className="text-xs font-mono text-evidencia uppercase tracking-wider font-semibold">
      [ERROR DE COMUNICACIÓN]
    </p>
    <p className="text-sm text-papel-dark">{message}</p>
    {onRetry && (
      <Button variant="secondary" onClick={onRetry} className="text-xs py-1 px-3 mt-2">
        REINTENTAR
      </Button>
    )}
  </div>
);
