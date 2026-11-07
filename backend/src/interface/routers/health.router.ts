import { Router, Request, Response } from 'express';

export function createHealthRouter(): Router {
  const router = Router();

  router.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'Sistema de Investigación Criminal API',
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}
