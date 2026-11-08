import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full border border-grafito-light bg-grafito p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-evidencia text-white text-[10px] font-mono tracking-widest px-4 py-1 uppercase">
          NO LOCALIZADO
        </div>

        <div className="space-y-2">
          <p className="font-mono text-xs text-alerta uppercase tracking-widest">
            ERROR 404 &mdash; ARCHIVO EXTRAVIADO
          </p>
          <h1 className="font-serif text-2xl text-papel tracking-wide">Expediente No Encontrado</h1>
          <p className="text-sm text-papel-dark leading-relaxed">
            La pista, caso o recurso al que intenta acceder no existe en la base de datos o ha sido
            archivado definitivamente.
          </p>
        </div>

        <div className="pt-4 border-t border-grafito-light flex justify-center">
          <Link
            href="/cases"
            className="inline-flex items-center justify-center px-5 py-2 font-mono text-xs uppercase tracking-wider bg-grafito-light text-papel hover:bg-papel hover:text-tinta transition-colors border border-grafito-light"
          >
            VOLVER AL PANEL DE CASOS
          </Link>
        </div>
      </div>
    </div>
  );
}
