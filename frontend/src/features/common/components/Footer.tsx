'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-grafito-light py-6 px-4 bg-grafito-dark/60 font-mono text-xs text-papel-muted transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className="font-serif text-sm tracking-wider text-papel">
            SISTEMA DE INVESTIGACIÓN CRIMINAL
          </span>
          <span className="hidden sm:inline text-papel-muted">&bull;</span>
          <span className="text-[11px] text-alerta">EXPEDIENTE FORENSE NOIR</span>
        </div>

        <div className="text-[11px] text-papel-muted">
          PROYECTO DE AULA &mdash; DESARROLLO WEB FULL-STACK & PARADIGMAS (2026-2)
          <span className="block sm:inline sm:ml-2 text-papel-dark font-medium">
            [USO ACADÉMICO EXCLUSIVO &bull; CASOS FICTICIOS]
          </span>
        </div>
      </div>
    </footer>
  );
};
