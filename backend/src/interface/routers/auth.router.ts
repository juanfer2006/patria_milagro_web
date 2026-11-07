import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { RegisterUseCase } from '../../application/use-cases/auth/register.use-case.js';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case.js';
import { GetCurrentUserUseCase } from '../../application/use-cases/auth/get-current-user.use-case.js';
import { PrismaUserRepository } from '../../infrastructure/repository/prisma-user.repository.js';
import { BcryptPasswordHasher } from '../../infrastructure/services/bcrypt-password-hasher.js';
import { JwtTokenService } from '../../infrastructure/services/jwt-token-service.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { registerBodySchema, loginBodySchema } from '../../infrastructure/dtos/auth.dto.js';

export function createAuthRouter(): Router {
  const router = Router();

  const userRepository = new PrismaUserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService();

  const registerUseCase = new RegisterUseCase(userRepository, passwordHasher, tokenService);
  const loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenService);
  const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);

  const authController = new AuthController(registerUseCase, loginUseCase, getCurrentUserUseCase);

  const authMiddleware = createAuthMiddleware(tokenService);

  router.post('/register', validate({ body: registerBodySchema }), authController.register);
  router.post('/login', validate({ body: loginBodySchema }), authController.login);
  router.get('/me', authMiddleware, authController.me);

  return router;
}
