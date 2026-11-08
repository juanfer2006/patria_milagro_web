import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { CaseStatus } from '../domain/case';
import { UseCasesFilters } from '../hooks/use-cases';
import { Button } from '../../common/components';

export interface CaseFiltersProps {
  filters: UseCasesFilters;
  onFilterChange: <K extends keyof UseCasesFilters>(key: K, value: UseCasesFilters[K]) => void;
  onReset: () => void;
}

export const CaseFilters: React.FC<CaseFiltersProps> = ({ filters, onFilterChange, onReset }) => {
  const hasActiveFilters = Boolean(filters.q || filters.status || filters.from || filters.to);

  return (
    <div className="p-4 border border-grafito-light bg-grafito shadow-md space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-grafito-light">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-alerta" />
          <span className="font-mono text-xs uppercase tracking-widest text-papel font-semibold">
            FILTROS DE BÚSQUEDA FORENSE
          </span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 font-mono text-xs text-alerta hover:text-alerta-hover transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>LIMPIAR FILTROS</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Búsqueda por texto */}
        <div className="space-y-1">
          <label
            htmlFor="filter-search"
            className="block text-xs font-mono tracking-wider text-papel-dark uppercase"
          >
            Buscar por título o ubicación
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-papel-muted pointer-events-none" />
            <input
              id="filter-search"
              type="text"
              value={filters.q}
              onChange={(e) => onFilterChange('q', e.target.value)}
              placeholder="Ej: Callejón, Homicidio..."
              className="w-full pl-9 pr-3 py-2 bg-grafito-dark border border-grafito-light text-papel text-sm placeholder:text-papel-muted/50 focus:outline-none focus:ring-1 focus:ring-alerta"
            />
          </div>
        </div>

        {/* Filtro por estado */}
        <div className="space-y-1">
          <label
            htmlFor="filter-status"
            className="block text-xs font-mono tracking-wider text-papel-dark uppercase"
          >
            Estado del expediente
          </label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value as CaseStatus | '')}
            className="w-full px-3 py-2 bg-grafito-dark border border-grafito-light text-papel text-sm focus:outline-none focus:ring-1 focus:ring-alerta"
          >
            <option value="">Todos los estados</option>
            <option value="OPEN">Abierto</option>
            <option value="IN_PROGRESS">En investigación</option>
            <option value="CLOSED">Cerrado</option>
          </select>
        </div>

        {/* Fecha inicial */}
        <div className="space-y-1">
          <label
            htmlFor="filter-from"
            className="block text-xs font-mono tracking-wider text-papel-dark uppercase"
          >
            Fecha del incidente (Desde)
          </label>
          <input
            id="filter-from"
            type="date"
            value={filters.from}
            onChange={(e) => onFilterChange('from', e.target.value)}
            className="w-full px-3 py-2 bg-grafito-dark border border-grafito-light text-papel text-sm focus:outline-none focus:ring-1 focus:ring-alerta [color-scheme:dark]"
          />
        </div>

        {/* Fecha final */}
        <div className="space-y-1">
          <label
            htmlFor="filter-to"
            className="block text-xs font-mono tracking-wider text-papel-dark uppercase"
          >
            Fecha del incidente (Hasta)
          </label>
          <input
            id="filter-to"
            type="date"
            value={filters.to}
            onChange={(e) => onFilterChange('to', e.target.value)}
            className="w-full px-3 py-2 bg-grafito-dark border border-grafito-light text-papel text-sm focus:outline-none focus:ring-1 focus:ring-alerta [color-scheme:dark]"
          />
        </div>
      </div>
    </div>
  );
};
