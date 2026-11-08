import { randomUUID } from 'node:crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  IStorageService,
  UploadFileInput,
  UploadResult,
} from '../../domain/services/storage.service.js';
import { env } from '../../config/env.js';
import { logger } from './logger.service.js';

export class SupabaseStorageService implements IStorageService {
  private readonly supabaseUrl: string | undefined;
  private readonly supabaseKey: string | undefined;
  private readonly bucket: string;
  private client: SupabaseClient | null = null;

  constructor(
    supabaseUrl: string | undefined = env.SUPABASE_URL,
    supabaseKey: string | undefined = env.SUPABASE_SERVICE_ROLE_KEY,
    bucket: string = env.SUPABASE_BUCKET,
  ) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    this.bucket = bucket;
  }

  private getClient(): SupabaseClient {
    if (!this.client) {
      if (!this.supabaseUrl || !this.supabaseKey) {
        logger.error('Variables de entorno de Supabase Storage no configuradas');
        throw new Error('Configuración de almacenamiento incompleta');
      }

      this.client = createClient(this.supabaseUrl, this.supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    }

    return this.client;
  }

  async uploadImage(
    file: UploadFileInput,
    folder: 'cases' | 'suspects' | 'evidences',
  ): Promise<UploadResult> {
    const client = this.getClient();

    const extension = this.getExtensionFromMimeType(file.mimetype);
    const filename = `${randomUUID()}.${extension}`;
    const storagePath = `${folder}/${filename}`;

    const { error: uploadError } = await client.storage
      .from(this.bucket)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      logger.error('Error al subir archivo a Supabase Storage', {
        errorMessage: uploadError.message,
        folder,
      });
      throw new Error('No fue posible almacenar la imagen');
    }

    const { data: publicUrlData } = client.storage.from(this.bucket).getPublicUrl(storagePath);

    return {
      url: publicUrlData.publicUrl,
      path: storagePath,
    };
  }

  private getExtensionFromMimeType(mimetype: string): string {
    switch (mimetype.toLowerCase()) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'image/webp':
        return 'webp';
      default:
        return 'jpg';
    }
  }
}
