import { Router } from 'express';

export function createUploadsRouter(): Router {
  const router = Router();

  // Stub de router de subidas - Integrante B implementará el endpoint de subida a Supabase
  router.all('*', (_req, res) => {
    res.status(501).json({
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Módulo de subidas de archivos en desarrollo por Integrante B',
      },
    });
  });

  return router;
}
