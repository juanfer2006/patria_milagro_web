import { Router } from 'express';
import { EvidencesController } from '../controllers/evidences.controller.js';
import {
  CreateEvidenceUseCase,
  ListEvidencesUseCase,
  GetEvidenceUseCase,
  UpdateEvidenceUseCase,
  DeleteEvidenceUseCase,
} from '../../application/use-cases/evidences/index.js';
import { PrismaEvidenceRepository } from '../../infrastructure/repository/prisma-evidence.repository.js';
import { PrismaCaseRepository } from '../../infrastructure/repository/prisma-case.repository.js';
import { PrismaSuspectRepository } from '../../infrastructure/repository/prisma-suspect.repository.js';
import { JwtTokenService } from '../../infrastructure/services/jwt-token-service.js';
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createEvidenceBodySchema,
  updateEvidenceBodySchema,
  listEvidencesQuerySchema,
} from '../../infrastructure/dtos/evidences.dto.js';
import { uuidParamSchema } from '../../infrastructure/dtos/users.dto.js';

export function createEvidencesRouter(): Router {
  const router = Router();

  const evidenceRepository = new PrismaEvidenceRepository();
  const caseRepository = new PrismaCaseRepository();
  const suspectRepository = new PrismaSuspectRepository();
  const tokenService = new JwtTokenService();

  const createEvidenceUseCase = new CreateEvidenceUseCase(
    evidenceRepository,
    caseRepository,
    suspectRepository,
  );
  const listEvidencesUseCase = new ListEvidencesUseCase(evidenceRepository, caseRepository);
  const getEvidenceUseCase = new GetEvidenceUseCase(evidenceRepository, caseRepository);
  const updateEvidenceUseCase = new UpdateEvidenceUseCase(
    evidenceRepository,
    caseRepository,
    suspectRepository,
  );
  const deleteEvidenceUseCase = new DeleteEvidenceUseCase(evidenceRepository, caseRepository);

  const evidencesController = new EvidencesController(
    createEvidenceUseCase,
    listEvidencesUseCase,
    getEvidenceUseCase,
    updateEvidenceUseCase,
    deleteEvidenceUseCase,
  );

  const authMiddleware = createAuthMiddleware(tokenService);

  // Todas las rutas de evidencias requieren autenticación
  router.use(authMiddleware);

  router.get('/', validate({ query: listEvidencesQuerySchema }), evidencesController.list);
  router.post('/', validate({ body: createEvidenceBodySchema }), evidencesController.create);
  router.get('/:id', validate({ params: uuidParamSchema }), evidencesController.getById);
  router.put(
    '/:id',
    validate({ params: uuidParamSchema, body: updateEvidenceBodySchema }),
    evidencesController.update,
  );
  router.delete('/:id', validate({ params: uuidParamSchema }), evidencesController.delete);

  return router;
}
