import React from 'react';
import { CaseStatus, CASE_STATUS_LABELS } from '../domain/case';

export interface CaseStatusBadgeProps {
  status: CaseStatus;
  className?: string;
}

export const CaseStatusBadge: React.FC<CaseStatusBadgeProps> = ({ status, className = '' }) => {
  const getStyles = () => {
    switch (status) {
      case 'OPEN':
        return 'bg-alerta/15 text-alerta border-alerta/40';
      case 'IN_PROGRESS':
        return 'bg-papel/10 text-papel border-papel/30';
      case 'CLOSED':
        return 'bg-evidencia/15 text-evidencia border-evidencia/40';
      default:
        return 'bg-grafito-light text-papel-muted border-grafito-light';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 border font-mono text-[11px] font-semibold tracking-wider uppercase ${getStyles()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {CASE_STATUS_LABELS[status] || status}
    </span>
  );
};
