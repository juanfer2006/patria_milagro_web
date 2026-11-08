import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Eye, Edit2, Trash2 } from 'lucide-react';
import { Case, formatCaseCode } from '../domain/case';
import { CaseStatusBadge } from './CaseStatusBadge';

export interface CaseCardProps {
  caseItem: Case;
  onDeleteRequest?: (caseItem: Case) => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({ caseItem, onDeleteRequest }) => {
  const formattedDate = new Date(caseItem.incidentDate).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="group relative flex flex-col justify-between border border-grafito-light bg-grafito hover:border-alerta/50 transition-colors shadow-lg overflow-hidden">
      <div>
        {/* Encabezado visual: imagen o marcador forense */}
        {caseItem.imageUrl ? (
          <div className="relative w-full h-44 overflow-hidden border-b border-grafito-light bg-grafito-dark">
            <Image
              src={caseItem.imageUrl}
              alt={caseItem.title}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Cinta de evidencia en la portada */}
            <div className="absolute top-2 left-0 bg-alerta text-tinta font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 shadow">
              CINTA DE EVIDENCIA
            </div>
            <div className="absolute top-2 right-2">
              <span className="font-serif text-[10px] uppercase tracking-widest text-evidencia bg-tinta/80 border border-evidencia/60 px-1.5 py-0.5 transform -rotate-3 select-none">
                CONFIDENCIAL
              </span>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-28 border-b border-grafito-light bg-grafito-dark/70 flex flex-col items-center justify-center p-4">
            <span className="font-serif text-[10px] uppercase tracking-widest text-evidencia border border-evidencia/60 px-2 py-0.5 mb-2 transform -rotate-2 select-none">
              CONFIDENCIAL
            </span>
            <span className="font-mono text-[11px] text-papel-muted uppercase tracking-wider">
              [CARPETA DE INVESTIGACIÓN]
            </span>
          </div>
        )}

        {/* Contenido de la tarjeta */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold text-alerta tracking-wider">
              {formatCaseCode(caseItem.caseNumber)}
            </span>
            <CaseStatusBadge status={caseItem.status} />
          </div>

          <h3 className="font-serif text-base text-papel leading-snug line-clamp-2 group-hover:text-alerta transition-colors">
            <Link href={`/cases/${caseItem.id}`}>{caseItem.title}</Link>
          </h3>

          <p className="text-xs text-papel-muted line-clamp-2 leading-relaxed">
            {caseItem.description}
          </p>

          <div className="pt-2 border-t border-grafito-light/60 space-y-1 font-mono text-[11px] text-papel-dark">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-alerta shrink-0" />
              <span className="truncate">{caseItem.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-papel-muted shrink-0" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción inferiores */}
      <div className="p-3 bg-grafito-dark/40 border-t border-grafito-light flex items-center justify-between gap-2">
        <Link
          href={`/cases/${caseItem.id}`}
          className="inline-flex items-center gap-1 font-mono text-xs text-papel-dark hover:text-papel transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-alerta" />
          <span>EXPEDIENTE</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href={`/cases/${caseItem.id}/edit`}
            className="p-1.5 text-papel-muted hover:text-alerta transition-colors"
            title="Editar caso"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Link>
          {onDeleteRequest && (
            <button
              type="button"
              onClick={() => onDeleteRequest(caseItem)}
              className="p-1.5 text-papel-muted hover:text-evidencia transition-colors"
              title="Eliminar caso"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
