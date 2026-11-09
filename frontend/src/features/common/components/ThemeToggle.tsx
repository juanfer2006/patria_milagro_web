'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('cr_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      const initialTheme = prefersLight ? 'light' : 'dark';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('cr_theme', nextTheme);
  };

  if (!mounted) {
    return (
      <div
        className={`w-8 h-8 rounded border border-grafito-light bg-grafito-dark/50 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === 'dark'
          ? 'Cambiar a modo claro (Papel Forense)'
          : 'Cambiar a modo oscuro (Expediente Noir)'
      }
      title={
        theme === 'dark'
          ? 'Modo actual: Expediente Noir (Oscuro). Clic para cambiar a Papel Forense'
          : 'Modo actual: Papel Forense (Claro). Clic para cambiar a Expediente Noir'
      }
      className={`inline-flex items-center justify-center p-1.5 border border-grafito-light bg-grafito hover:bg-grafito-light text-papel hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-alerta ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-alerta" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4 text-evidencia" aria-hidden="true" />
      )}
      <span className="sr-only">
        {theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
      </span>
    </button>
  );
};
