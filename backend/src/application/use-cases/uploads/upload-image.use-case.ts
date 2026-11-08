import { IStorageService, UploadResult } from '../../../domain/services/index.js';
import { ValidationError, PayloadTooLargeError } from '../../errors/app-error.js';

export interface UploadImageInput {
  file?: {
    buffer: Buffer;
    mimetype: string;
    originalname?: string;
    size?: number;
  };
  folder: 'cases' | 'suspects' | 'evidences';
}

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export class UploadImageUseCase {
  constructor(private readonly storageService: IStorageService) {}

  async execute(input: UploadImageInput): Promise<UploadResult> {
    if (!input.file || !input.file.buffer) {
      throw new ValidationError('No se ha proporcionado ningún archivo para subir', [
        { field: 'file', message: 'El archivo es obligatorio en el campo file' },
      ]);
    }

    if (!ALLOWED_MIMETYPES.includes(input.file.mimetype.toLowerCase())) {
      throw new ValidationError(
        'Tipo de archivo no permitido. Solo se aceptan formatos JPEG, PNG y WEBP',
        [
          {
            field: 'file',
            message: 'Tipo de archivo no permitido. Solo se aceptan JPEG, PNG y WEBP',
          },
        ],
      );
    }

    const fileSize = input.file.size ?? input.file.buffer.length;
    if (fileSize > MAX_FILE_SIZE) {
      throw new PayloadTooLargeError('El archivo excede el tamaño máximo permitido de 5 MB');
    }

    return this.storageService.uploadImage(
      {
        buffer: input.file.buffer,
        mimetype: input.file.mimetype,
        originalName: input.file.originalname ?? 'image',
      },
      input.folder,
    );
  }
}
