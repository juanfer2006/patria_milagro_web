import { Router } from 'express';
import { SuspectsController } from '../controllers/suspects.controller.js';
import {
  CreateSuspectUseCase,
  GetSuspectUseCase,
  UpdateSuspectUseCase,
  DeleteSuspectUseCase,
  ListSuspectsUseCase,
} from '../../application/use-cases/suspects/index.js';
import { PrismaSuspectRepository } from '../../infrastructure/repository/prisma-suspect.repository.js';
import { PrismaCaseRepository } from '../../infrastructure/repository/prisma-case.repository.js';
import { JwtTokenService } from '../../infrastructure/services/jwt-token-service.js';
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createSuspectBodySchema,
  updateSuspectBodySchema,
  suspectIdParamSchema,
  listSuspectsQuerySchema,
} from '../../infrastructure/dtos/suspects.dto.js';

export function createSuspectsRouter(): Router {
  const router = Router();

  // Dependencias internas
  const suspectRepository = new PrismaSuspectRepository();
  const caseRepository = new PrismaCaseRepository();
  const tokenService = new JwtTokenService();

  const createSuspectUseCase = new CreateSuspectUseCase(suspectRepository, caseRepository);
  const getSuspectUseCase = new GetSuspectUseCase(suspectRepository, caseRepository);
  const updateSuspectUseCase = new UpdateSuspectUseCase(suspectRepository, caseRepository);
  const deleteSuspectUseCase = new DeleteSuspectUseCase(suspectRepository, caseRepository);
  const listSuspectsUseCase = new ListSuspectsUseCase(suspectRepository, caseRepository);

  const controller = new SuspectsController(
    createSuspectUseCase,
    getSuspectUseCase,
    updateSuspectUseCase,
    deleteSuspectUseCase,
    listSuspectsUseCase,
  );

  const authMiddleware = createAuthMiddleware(tokenService);

  // Todas las rutas de sospechosos requieren autenticación
  router.use(authMiddleware);

  // GET /api/suspects (paginado + filtros)
  router.get('/', validate({ query: listSuspectsQuerySchema }), controller.list);

  // POST /api/suspects (crear sospechoso)
  router.post('/', validate({ body: createSuspectBodySchema }), controller.create);

  // GET /api/suspects/:id
  router.get('/:id', validate({ params: suspectIdParamSchema }), controller.getById);

  // PUT /api/suspects/:id
  router.put(
    '/:id',
    validate({ params: suspectIdParamSchema, body: updateSuspectBodySchema }),
    controller.update,
  );

  // DELETE /api/suspects/:id
  router.delete('/:id', validate({ params: suspectIdParamSchema }), controller.delete);

  return router;
}
