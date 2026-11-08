import { httpClient } from '../http/http-client';

export interface UploadImageResult {
  url: string;
  path: string;
}

export class UploadService {
  async uploadImage(
    file: File,
    folder: 'cases' | 'suspects' | 'evidences' = 'cases',
  ): Promise<UploadImageResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await httpClient.upload<{ data: UploadImageResult }>(formData);
    return response.data;
  }
}

export const uploadService = new UploadService();
