import { Router } from 'express';

export function createCasesRouter(): Router {
  const router = Router();

  // Stub de router de casos - Integrante B implementará los endpoints completos
  router.all('*', (_req, res) => {
    res.status(501).json({
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Módulo de casos en desarrollo por Integrante B',
      },
    });
  });

  return router;
}
