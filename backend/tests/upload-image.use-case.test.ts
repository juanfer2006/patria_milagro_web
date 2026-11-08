import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UploadImageUseCase } from '../src/application/use-cases/uploads/upload-image.use-case.js';
import { ValidationError, PayloadTooLargeError } from '../src/application/errors/app-error.js';
import { IStorageService, UploadFileInput } from '../src/domain/services/index.js';

describe('UploadImageUseCase', () => {
  const mockStorageService: IStorageService = {
    uploadImage: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe lanzar ValidationError si no se proporciona ningún archivo', async () => {
    const useCase = new UploadImageUseCase(mockStorageService);

    await expect(
      useCase.execute({
        file: undefined,
        folder: 'cases',
      }),
    ).rejects.toThrow(ValidationError);
  });

  it('debe lanzar ValidationError si el tipo de archivo no es permitido (ej. application/pdf)', async () => {
    const useCase = new UploadImageUseCase(mockStorageService);

    await expect(
      useCase.execute({
        file: {
          buffer: Buffer.from('contenido-pdf'),
          mimetype: 'application/pdf',
          originalname: 'documento.pdf',
        },
        folder: 'cases',
      }),
    ).rejects.toThrow(ValidationError);
  });

  it('debe lanzar PayloadTooLargeError si el archivo excede los 5 MB', async () => {
    const useCase = new UploadImageUseCase(mockStorageService);
    const oversizedBuffer = Buffer.alloc(5 * 1024 * 1024 + 1);

    await expect(
      useCase.execute({
        file: {
          buffer: oversizedBuffer,
          mimetype: 'image/png',
          originalname: 'pesada.png',
          size: oversizedBuffer.length,
        },
        folder: 'cases',
      }),
    ).rejects.toThrow(PayloadTooLargeError);
  });

  it('debe subir la imagen exitosamente y generar ruta adecuada', async () => {
    vi.mocked(mockStorageService.uploadImage).mockImplementation(
      async (file: UploadFileInput, folder: 'cases' | 'suspects' | 'evidences') => {
        expect(file.originalName).toBe('evidencia-sangre.png');
        return {
          url: `https://supabase.co/storage/v1/object/public/case-images/${folder}/uuid-aleatorio.png`,
          path: `${folder}/uuid-aleatorio.png`,
        };
      },
    );

    const useCase = new UploadImageUseCase(mockStorageService);
    const result = await useCase.execute({
      file: {
        buffer: Buffer.from('bytes-de-imagen-valida'),
        mimetype: 'image/png',
        originalname: 'evidencia-sangre.png',
        size: 100,
      },
      folder: 'evidences',
    });

    expect(mockStorageService.uploadImage).toHaveBeenCalled();
    expect(result.url).toContain('case-images/evidences/uuid-aleatorio.png');
    expect(result.path).toBe('evidences/uuid-aleatorio.png');
    // Verifica que no use el nombre original en la ruta retornada
    expect(result.path).not.toContain('evidencia-sangre');
  });
});
