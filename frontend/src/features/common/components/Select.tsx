'use client';

import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, id, children, className = '', ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || props.name || generatedId;
    const errorId = `${selectId}-error`;
    const hintId = `${selectId}-hint`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-mono tracking-wider text-papel-dark uppercase font-semibold"
          >
            {label}
            {props.required && <span className="text-evidencia ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`w-full px-3 py-2 bg-grafito-dark border font-sans text-sm text-papel transition-colors focus:outline-none focus:ring-1 ${
            error
              ? 'border-evidencia focus:border-evidencia focus:ring-evidencia'
              : 'border-grafito-light focus:border-alerta focus:ring-alerta'
          } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          {...props}
        >
          {children}
        </select>
        {hint && !error && (
          <p id={hintId} className="text-xs text-papel-muted font-sans">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-xs text-evidencia font-mono font-medium">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
