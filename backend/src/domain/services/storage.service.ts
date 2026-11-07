export interface UploadFileInput {
  buffer: Buffer;
  mimetype: string;
  originalName: string;
}

export interface UploadResult {
  url: string;
  path: string;
}

export interface IStorageService {
  uploadImage(
    file: UploadFileInput,
    folder: 'cases' | 'suspects' | 'evidences',
  ): Promise<UploadResult>;
}
