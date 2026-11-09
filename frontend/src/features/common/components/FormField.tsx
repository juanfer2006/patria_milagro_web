'use client';

import React from 'react';

export interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ children, className = '' }) => (
  <div className={`space-y-1.5 ${className}`}>{children}</div>
);
