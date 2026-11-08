'use client';

import { useState, useCallback } from 'react';
import { uploadService } from '../services/upload.service';
import { isApiError } from '../domain/api-error';

export interface UseImageUploadReturn {
  isUploading: boolean;
  error: string | null;
  upload: (file: File, folder?: 'cases' | 'suspects' | 'evidences') => Promise<string | null>;
  clearError: () => void;
}

export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const upload = useCallback(
    async (
      file: File,
      folder: 'cases' | 'suspects' | 'evidences' = 'cases',
    ): Promise<string | null> => {
      setIsUploading(true);
      setError(null);

      try {
        const result = await uploadService.uploadImage(file, folder);
        return result.url;
      } catch (err: unknown) {
        if (isApiError(err)) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocurrió un error inesperado al subir la imagen');
        }
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  return {
    isUploading,
    error,
    upload,
    clearError,
  };
}
