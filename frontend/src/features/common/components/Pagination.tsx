'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="Paginación de resultados"
      className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-grafito-light pt-4 px-2 font-mono text-xs"
    >
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Ir a la página anterior"
          className="text-xs py-1.5 px-3"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
          ANTERIOR
        </Button>
      </div>

      <div className="text-papel-muted text-center select-none" aria-live="polite">
        PÁGINA <strong className="text-papel font-bold">{page}</strong> DE{' '}
        <strong className="text-papel font-bold">{totalPages}</strong>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Ir a la página siguiente"
          className="text-xs py-1.5 px-3"
        >
          SIGUIENTE
          <ChevronRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
};
