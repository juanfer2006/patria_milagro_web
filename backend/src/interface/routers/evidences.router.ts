import { Router } from 'express';

export function createEvidencesRouter(): Router {
  const router = Router();

  // Stub de router de evidencias - Integrante D implementará los endpoints completos
  router.all('*', (_req, res) => {
    res.status(501).json({
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Módulo de evidencias en desarrollo por Integrante D',
      },
    });
  });

  return router;
}
