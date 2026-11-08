'use client';

import React from 'react';
import Image from 'next/image';
import { FileText, Calendar, User, Edit2, Trash2, AlertTriangle, ZoomIn } from 'lucide-react';
import {
  Evidence,
  EvidenceTypeLabels,
  EvidenceTypeBadgeStyles,
  RelevanceDescriptions,
  formatEvidenceDate,
} from '../domain/evidence';
import { SuspectLookupOption } from '../services/suspects-lookup';

export interface EvidenceCardProps {
  evidence: Evidence;
  suspects: SuspectLookupOption[];
  onEdit: (evidence: Evidence) => void;
  onDelete: (evidence: Evidence) => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  evidence,
  suspects,
  onEdit,
  onDelete,
}) => {
  const badgeStyle = EvidenceTypeBadgeStyles[evidence.type];
  const typeLabel = EvidenceTypeLabels[evidence.type] || evidence.type;
  const relevanceLabel = RelevanceDescriptions[evidence.relevance] || `Nivel ${evidence.relevance}`;

  const linkedSuspect = evidence.suspectId
    ? suspects.find((s) => s.id === evidence.suspectId)
    : null;

  return (
    <article className="border border-grafito-light bg-grafito p-4 shadow-md hover:border-grafito-light/90 transition-all flex flex-col justify-between group relative overflow-hidden">
      {/* Cinta superior sutil de expediente */}
      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
        <div className="bg-alerta text-tinta font-mono text-[8px] font-bold py-0.5 text-center uppercase tracking-wider transform rotate-45 translate-x-4 translate-y-2 w-24 select-none">
          EVIDENCIA
        </div>
      </div>

      <div className="space-y-3">
        {/* Cabecera: Tipo de Evidencia y Relevancia */}
        <div className="flex flex-wrap items-center justify-between gap-2 pr-10">
          <span
            className={`inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
          >
            {typeLabel}
          </span>

          {/* Indicador de Relevancia (1-5) */}
          <div
            className="flex items-center gap-1.5"
            title={`Nivel de Relevancia Forense: ${evidence.relevance} de 5 (${relevanceLabel})`}
            aria-label={`Relevancia ${evidence.relevance} de 5: ${relevanceLabel}`}
          >
            <span className="text-[10px] font-mono text-papel-muted uppercase tracking-wider">
              RELEVANCIA:
            </span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <span
                  key={lvl}
                  className={`w-2.5 h-2.5 rounded-none border ${
                    lvl <= evidence.relevance
                      ? 'bg-alerta border-alerta'
                      : 'bg-grafito-dark border-grafito-light'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="font-mono text-xs font-bold text-alerta ml-1">
              {evidence.relevance}/5
            </span>
          </div>
        </div>

        {/* Imagen fijada (si existe) */}
        {evidence.imageUrl ? (
          <div className="relative w-full h-44 sm:h-48 border border-grafito-light bg-grafito-dark overflow-hidden group/img">
            <Image
              src={evidence.imageUrl}
              alt={evidence.title}
              fill
              unoptimized
              className="object-cover group-hover/img:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-2 left-2 bg-tinta/80 px-2 py-0.5 font-mono text-[9px] text-papel border border-grafito-light flex items-center gap-1">
              <ZoomIn className="w-3 h-3 text-alerta" />
              <span>REGISTRO FOTOGRÁFICO</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-24 border border-dashed border-grafito-light/60 bg-grafito-dark/40 flex flex-col items-center justify-center text-papel-muted">
            <FileText className="w-6 h-6 mb-1 text-papel-muted/50" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-wider">
              Sin archivo fotográfico adjunto
            </span>
          </div>
        )}

        {/* Título y Descripción */}
        <div>
          <h4 className="font-serif text-base text-papel font-semibold leading-snug">
            {evidence.title}
          </h4>
          <p className="mt-1 text-xs text-papel-dark font-sans leading-relaxed line-clamp-3">
            {evidence.description}
          </p>
        </div>

        {/* Metadatos: Fecha de recolección y Sospechoso vinculado */}
        <div className="pt-2 border-t border-grafito-light/50 space-y-1.5 font-mono text-[11px] text-papel-muted">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-alerta shrink-0" aria-hidden="true" />
            <span>Fijada: {formatEvidenceDate(evidence.collectedAt)}</span>
          </div>

          {linkedSuspect ? (
            <div className="flex items-center gap-1.5 text-alerta">
              <User className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>
                Sospechoso vinculado: <strong>{linkedSuspect.fullName}</strong>
                {linkedSuspect.alias && ` (${linkedSuspect.alias})`}
              </span>
            </div>
          ) : evidence.suspectId ? (
            <div className="flex items-center gap-1.5 text-papel-muted">
              <User className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Sospechoso ID: {evidence.suspectId.slice(0, 8)}...</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-grafito-light/60">
        <button
          type="button"
          onClick={() => onEdit(evidence)}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-papel-dark hover:text-papel px-2.5 py-1 border border-grafito-light bg-grafito-dark hover:bg-grafito-light transition-colors"
          aria-label={`Editar evidencia: ${evidence.title}`}
        >
          <Edit2 className="w-3 h-3 text-alerta" aria-hidden="true" />
          <span>EDITAR</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete(evidence)}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-evidencia hover:text-white px-2.5 py-1 border border-evidencia/50 hover:bg-evidencia transition-colors"
          aria-label={`Eliminar evidencia: ${evidence.title}`}
        >
          <Trash2 className="w-3 h-3" aria-hidden="true" />
          <span>ELIMINAR</span>
        </button>
      </div>
    </article>
  );
};
