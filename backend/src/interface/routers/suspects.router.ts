import { Router } from 'express';

export function createSuspectsRouter(): Router {
  const router = Router();

  // Stub de router de sospechosos - Integrante C implementará los endpoints completos
  router.all('*', (_req, res) => {
    res.status(501).json({
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Módulo de sospechosos en desarrollo por Integrante C',
      },
    });
  });

  return router;
}
