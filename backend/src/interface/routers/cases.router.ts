import { Router } from 'express';
import { CasesController } from '../controllers/cases.controller.js';
import { CreateCaseUseCase } from '../../application/use-cases/cases/create-case.use-case.js';
import { ListCasesUseCase } from '../../application/use-cases/cases/list-cases.use-case.js';
import { GetCaseUseCase } from '../../application/use-cases/cases/get-case.use-case.js';
import { UpdateCaseUseCase } from '../../application/use-cases/cases/update-case.use-case.js';
import { DeleteCaseUseCase } from '../../application/use-cases/cases/delete-case.use-case.js';
import { PrismaCaseRepository } from '../../infrastructure/repository/prisma-case.repository.js';
import { JwtTokenService } from '../../infrastructure/services/jwt-token-service.js';
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createCaseBodySchema,
  updateCaseBodySchema,
  listCasesQuerySchema,
} from '../../infrastructure/dtos/cases.dto.js';
import { uuidParamSchema } from '../../infrastructure/dtos/users.dto.js';

export function createCasesRouter(): Router {
  const router = Router();

  const caseRepository = new PrismaCaseRepository();
  const tokenService = new JwtTokenService();

  const createCaseUseCase = new CreateCaseUseCase(caseRepository);
  const listCasesUseCase = new ListCasesUseCase(caseRepository);
  const getCaseUseCase = new GetCaseUseCase(caseRepository);
  const updateCaseUseCase = new UpdateCaseUseCase(caseRepository);
  const deleteCaseUseCase = new DeleteCaseUseCase(caseRepository);

  const casesController = new CasesController(
    createCaseUseCase,
    listCasesUseCase,
    getCaseUseCase,
    updateCaseUseCase,
    deleteCaseUseCase,
  );

  const authMiddleware = createAuthMiddleware(tokenService);

  // Todas las rutas de casos requieren autenticación
  router.use(authMiddleware);

  router.get('/', validate({ query: listCasesQuerySchema }), casesController.list);
  router.post('/', validate({ body: createCaseBodySchema }), casesController.create);
  router.get('/:id', validate({ params: uuidParamSchema }), casesController.getById);
  router.put(
    '/:id',
    validate({ params: uuidParamSchema, body: updateCaseBodySchema }),
    casesController.update,
  );
  router.delete('/:id', validate({ params: uuidParamSchema }), casesController.delete);

  return router;
}
