'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

// Button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors border focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary:
      'bg-evidencia border-evidencia text-papel hover:bg-evidencia-hover focus:ring-evidencia',
    secondary:
      'bg-grafito border-grafito-light text-papel hover:bg-grafito-light focus:ring-papel-muted',
    danger: 'bg-red-900 border-red-700 text-red-100 hover:bg-red-800 focus:ring-red-500',
    ghost:
      'bg-transparent border-transparent text-papel-dark hover:bg-grafito-light hover:text-papel focus:ring-grafito-light',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

// Input
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || props.name;
  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-mono tracking-wider text-papel-dark uppercase"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3 py-2 bg-grafito-dark border ${
          error ? 'border-evidencia focus:ring-evidencia' : 'border-grafito-light focus:ring-alerta'
        } text-papel text-sm focus:outline-none focus:ring-1 transition-colors ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-papel-muted">{hint}</p>}
      {error && <p className="text-xs text-evidencia font-mono">{error}</p>}
    </div>
  );
};

// Select
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  hint,
  id,
  children,
  className = '',
  ...props
}) => {
  const selectId = id || props.name;
  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-mono tracking-wider text-papel-dark uppercase"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-3 py-2 bg-grafito-dark border ${
          error ? 'border-evidencia focus:ring-evidencia' : 'border-grafito-light focus:ring-alerta'
        } text-papel text-sm focus:outline-none focus:ring-1 transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
      {hint && !error && <p className="text-xs text-papel-muted">{hint}</p>}
      {error && <p className="text-xs text-evidencia font-mono">{error}</p>}
    </div>
  );
};

// Textarea
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  hint,
  id,
  className = '',
  ...props
}) => {
  const textareaId = id || props.name;
  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-mono tracking-wider text-papel-dark uppercase"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full px-3 py-2 bg-grafito-dark border ${
          error ? 'border-evidencia focus:ring-evidencia' : 'border-grafito-light focus:ring-alerta'
        } text-papel text-sm focus:outline-none focus:ring-1 transition-colors ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-papel-muted">{hint}</p>}
      {error && <p className="text-xs text-evidencia font-mono">{error}</p>}
    </div>
  );
};

// FormField
export interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ children, className = '' }) => (
  <div className={`space-y-1 ${className}`}>{children}</div>
);

// Pagination
export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-grafito-light pt-4 px-2 font-mono text-xs">
      <Button variant="secondary" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        ANTERIOR
      </Button>
      <span className="text-papel-muted">
        PÁGINA <strong className="text-papel">{page}</strong> DE{' '}
        <strong className="text-papel">{totalPages}</strong>
      </span>
      <Button
        variant="secondary"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        SIGUIENTE
      </Button>
    </div>
  );
};

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tinta/80 backdrop-blur-sm">
      <div className="w-full max-w-lg border border-grafito-light bg-grafito p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-grafito-light">
          <h3 className="text-base font-serif tracking-wider text-papel">{title}</h3>
          <button onClick={onClose} className="text-papel-muted hover:text-papel font-mono text-sm">
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
      <p className="text-sm text-papel-dark mb-6 leading-relaxed">{message}</p>
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
  <div className="flex justify-center items-center p-4">
    <Loader2 className={`animate-spin text-alerta ${className}`} />
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
    <span className="font-mono text-xs uppercase tracking-widest text-alerta mb-2">
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
  <div className="p-4 border border-evidencia/60 bg-evidencia/10 text-papel space-y-2">
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
