'use client';

import React, { useId, useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { useImageUpload } from '../hooks/use-image-upload';

export interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  folder: 'cases' | 'suspects' | 'evidences';
  label?: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  folder,
  label = 'Fotografía / Evidencia',
}) => {
  const inputId = useId();
  const { isUploading, error: uploadError, upload, clearError } = useImageUpload();
  const [clientError, setClientError] = useState<string | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    clearError();
    setClientError(null);

    // Validación en el cliente: Tipo de archivo
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setClientError('Formato no permitido. Solo se aceptan imágenes JPEG, PNG o WEBP.');
      e.target.value = '';
      return;
    }

    // Validación en el cliente: Tamaño máximo 5 MB
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setClientError('El archivo excede el tamaño máximo permitido de 5 MB.');
      e.target.value = '';
      return;
    }

    const uploadedUrl = await upload(file, folder);
    if (uploadedUrl) {
      onChange(uploadedUrl);
    }

    // Limpia el input para permitir volver a seleccionar el mismo archivo si es necesario
    e.target.value = '';
  };

  const handleRemove = () => {
    setClientError(null);
    clearError();
    onChange('');
  };

  const activeError = clientError || uploadError;

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-xs font-mono tracking-wider text-papel-dark uppercase"
      >
        {label} <span className="text-papel-muted">({folder})</span>
      </label>

      {value ? (
        <div className="relative w-full h-48 sm:h-56 border border-grafito-light bg-grafito-dark overflow-hidden group">
          <Image
            src={value}
            alt="Vista previa del archivo"
            fill
            unoptimized
            className="object-cover"
          />
          {/* Cinta forense visual */}
          <div className="absolute top-2 left-2 bg-tinta/80 border border-alerta/50 px-2 py-0.5 text-[10px] font-mono text-alerta uppercase tracking-widest">
            ADJUNTO REGISTRADO
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-evidencia/90 hover:bg-evidencia text-papel transition-colors rounded-sm shadow-md"
            title="Quitar imagen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative border-2 border-dashed border-grafito-light hover:border-alerta/60 bg-grafito-dark/60 transition-colors p-6 text-center">
          <input
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={isUploading}
            className="sr-only"
          />
          <label
            htmlFor={inputId}
            className={`flex flex-col items-center justify-center cursor-pointer ${
              isUploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="w-8 h-8 text-alerta animate-spin" />
                <span className="text-xs font-mono text-alerta tracking-wide">
                  SUBIENDO AL ARCHIVO FORENSE...
                </span>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-papel-muted mb-2 group-hover:text-alerta transition-colors" />
                <span className="text-sm font-sans text-papel font-medium">
                  Haga clic para seleccionar una imagen
                </span>
                <span className="text-xs font-mono text-papel-muted mt-1">
                  Formatos admitidos: JPEG, PNG, WEBP (Máx. 5 MB)
                </span>
              </>
            )}
          </label>
        </div>
      )}

      {activeError && (
        <p role="alert" className="text-xs font-mono text-evidencia mt-1">
          {activeError}
        </p>
      )}
    </div>
  );
};
