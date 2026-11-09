'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      loading = false,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider px-4 py-2 font-medium transition-all duration-150 border focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

    const variants = {
      primary:
        'bg-evidencia border-evidencia text-white hover:bg-evidencia-hover focus:ring-evidencia shadow-sm active:translate-y-px',
      secondary:
        'bg-grafito border-grafito-light text-papel hover:bg-grafito-light hover:text-white focus:ring-alerta shadow-sm active:translate-y-px',
      danger:
        'bg-red-900/90 border-red-700 text-red-100 hover:bg-red-800 focus:ring-red-500 shadow-sm active:translate-y-px',
      ghost:
        'bg-transparent border-transparent text-papel-dark hover:bg-grafito-light/50 hover:text-papel focus:ring-grafito-light',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin shrink-0" aria-hidden="true" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
