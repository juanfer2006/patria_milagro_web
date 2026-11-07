import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { ListUsersUseCase } from '../../application/use-cases/users/list-users.use-case.js';
import { DeactivateUserUseCase } from '../../application/use-cases/users/deactivate-user.use-case.js';
import { PrismaUserRepository } from '../../infrastructure/repository/prisma-user.repository.js';
import { JwtTokenService } from '../../infrastructure/services/jwt-token-service.js';
import { createAuthMiddleware, requireRole } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { listUsersQuerySchema, uuidParamSchema } from '../../infrastructure/dtos/users.dto.js';
import { Role } from '../../domain/models/index.js';

export function createUsersRouter(): Router {
  const router = Router();

  const userRepository = new PrismaUserRepository();
  const tokenService = new JwtTokenService();

  const listUsersUseCase = new ListUsersUseCase(userRepository);
  const deactivateUserUseCase = new DeactivateUserUseCase(userRepository);

  const usersController = new UsersController(listUsersUseCase, deactivateUserUseCase);

  const authMiddleware = createAuthMiddleware(tokenService);

  // Todo el router de usuarios está restringido a administradores autenticados
  router.use(authMiddleware);
  router.use(requireRole(Role.ADMIN));

  router.get('/', validate({ query: listUsersQuerySchema }), usersController.list);
  router.delete('/:id', validate({ params: uuidParamSchema }), usersController.deactivate);

  return router;
}
