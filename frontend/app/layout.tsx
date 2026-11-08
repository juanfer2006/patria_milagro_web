import type { Metadata } from 'next';
import { Special_Elite, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../src/features/auth';

const specialElite = Special_Elite({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-special-elite',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sistema de Investigación Criminal | Expediente Forense',
  description: 'Gestión y análisis forense de investigaciones criminales ficticias',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${specialElite.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="bg-tinta text-papel antialiased min-h-screen flex flex-col selection:bg-evidencia selection:text-white">
        <AuthProvider>
          {/* Espacio reservado para el Navbar de D */}
          <header id="app-navbar-slot" className="w-full">
            <nav className="border-b border-grafito-light bg-grafito/60 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg tracking-wider text-papel border-l-2 border-evidencia pl-3">
                  EXPEDIENTE FORENSE
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase bg-grafito-dark text-alerta px-2 py-0.5 border border-grafito-light">
                  CONFIDENCIAL
                </span>
              </div>
            </nav>
          </header>

          <main className="flex-1 flex flex-col">{children}</main>

          {/* Espacio reservado para el Footer de D */}
          <footer className="border-t border-grafito-light py-4 text-center font-mono text-xs text-papel-muted bg-grafito-dark/40">
            SISTEMA DE INVESTIGACIÓN CRIMINAL &copy; 2026 &mdash; USO ACADÉMICO EXCLUSIVO
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
