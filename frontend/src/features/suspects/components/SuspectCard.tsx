'use client';

import React from 'react';
import Image from 'next/image';
import { User, Edit, Trash2 } from 'lucide-react';
import { Suspect, SUSPECT_STATUS_LABELS, SUSPECT_STATUS_COLORS } from '../domain/suspect';
import { Button } from '../../common/components';

export interface SuspectCardProps {
  suspect: Suspect;
  onEdit: (suspect: Suspect) => void;
  onDelete: (suspect: Suspect) => void;
}

export const SuspectCard: React.FC<SuspectCardProps> = ({ suspect, onEdit, onDelete }) => {
  const statusConfig = SUSPECT_STATUS_COLORS[suspect.status];

  return (
    <div className="border border-grafito-light bg-grafito p-4 shadow flex flex-col justify-between hover:border-grafito-light/80 transition-colors">
      <div className="flex gap-4">
        {/* Foto de ficha policial o silueta por defecto */}
        <div className="relative w-20 h-24 bg-grafito-dark border border-grafito-light shrink-0 overflow-hidden flex items-center justify-center">
          {suspect.photoUrl ? (
            <Image
              src={suspect.photoUrl}
              alt={suspect.fullName}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <User className="w-8 h-8 text-papel-muted/50" />
          )}
        </div>

        {/* Datos del sospechoso */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-serif text-base text-papel font-medium truncate">
                {suspect.fullName}
              </h4>
              {suspect.alias && (
                <p className="font-mono text-xs text-alerta">Alias: &quot;{suspect.alias}&quot;</p>
              )}
            </div>

            <span
              className={`text-[10px] font-mono px-2 py-0.5 border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} uppercase shrink-0`}
            >
              {SUSPECT_STATUS_LABELS[suspect.status]}
            </span>
          </div>

          {suspect.description && (
            <p className="text-xs text-papel-muted line-clamp-2 leading-relaxed">
              {suspect.description}
            </p>
          )}

          {/* Medidor visual de nivel de sospecha */}
          <div className="pt-2">
            <div className="flex justify-between items-center text-[11px] font-mono mb-1">
              <span className="text-papel-muted">Índice de Sospecha:</span>
              <span
                className={`font-bold ${
                  suspect.suspicionLevel >= 70
                    ? 'text-evidencia'
                    : suspect.suspicionLevel >= 40
                      ? 'text-alerta'
                      : 'text-papel'
                }`}
              >
                {suspect.suspicionLevel}%
              </span>
            </div>
            <div
              className="w-full bg-grafito-dark h-2 border border-grafito-light/60 overflow-hidden"
              role="meter"
              aria-valuenow={suspect.suspicionLevel}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Nivel de sospecha de ${suspect.fullName}: ${suspect.suspicionLevel} por ciento`}
            >
              <div
                className={`h-full transition-all duration-300 ${
                  suspect.suspicionLevel >= 70
                    ? 'bg-evidencia'
                    : suspect.suspicionLevel >= 40
                      ? 'bg-alerta'
                      : 'bg-papel-muted'
                }`}
                style={{ width: `${suspect.suspicionLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción (Editar y Eliminar permitidos aun en caso cerrado) */}
      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-grafito-light/60">
        <Button
          variant="ghost"
          onClick={() => onEdit(suspect)}
          className="text-xs py-1 px-2.5 flex items-center gap-1.5"
          aria-label={`Editar ficha de ${suspect.fullName}`}
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Editar</span>
        </Button>
        <Button
          variant="danger"
          onClick={() => onDelete(suspect)}
          className="text-xs py-1 px-2.5 flex items-center gap-1.5"
          aria-label={`Eliminar sospechoso ${suspect.fullName}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Eliminar</span>
        </Button>
      </div>
    </div>
  );
};
