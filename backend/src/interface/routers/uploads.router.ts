import { Router } from 'express';
import { UploadsController } from '../controllers/uploads.controller.js';
import { UploadImageUseCase } from '../../application/use-cases/uploads/upload-image.use-case.js';
import { SupabaseStorageService } from '../../infrastructure/services/supabase-storage.service.js';
import { JwtTokenService } from '../../infrastructure/services/jwt-token-service.js';
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { createUploadMiddleware } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { uploadBodySchema } from '../../infrastructure/dtos/uploads.dto.js';

export function createUploadsRouter(): Router {
  const router = Router();

  const storageService = new SupabaseStorageService();
  const tokenService = new JwtTokenService();

  const uploadImageUseCase = new UploadImageUseCase(storageService);
  const uploadsController = new UploadsController(uploadImageUseCase);

  const authMiddleware = createAuthMiddleware(tokenService);
  const uploadMiddleware = createUploadMiddleware();

  // 1. Autenticación antes de procesar archivos
  router.use(authMiddleware);

  // 2. Middleware de multer, luego validación de body (folder), luego controlador
  router.post(
    '/',
    uploadMiddleware,
    validate({ body: uploadBodySchema }),
    uploadsController.upload,
  );

  return router;
}
