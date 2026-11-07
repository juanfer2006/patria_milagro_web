import { Router } from 'express';
import { createHealthRouter } from './health.router.js';
import { createAuthRouter } from './auth.router.js';
import { createUsersRouter } from './users.router.js';
import { createCasesRouter } from './cases.router.js';
import { createSuspectsRouter } from './suspects.router.js';
import { createEvidencesRouter } from './evidences.router.js';
import { createUploadsRouter } from './uploads.router.js';

export function createApiRouter(): Router {
  const router = Router();

  router.use('/health', createHealthRouter());
  router.use('/auth', createAuthRouter());
  router.use('/users', createUsersRouter());
  router.use('/cases', createCasesRouter());
  router.use('/suspects', createSuspectsRouter());
  router.use('/evidences', createEvidencesRouter());
  router.use('/uploads', createUploadsRouter());

  return router;
}
