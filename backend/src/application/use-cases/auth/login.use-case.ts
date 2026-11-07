import { IUserRepository } from '../../../domain/repository/index.js';
import { IPasswordHasher, ITokenService } from '../../../domain/services/index.js';
import { PublicUser, RecordState } from '../../../domain/models/index.js';
import { UnauthorizedError } from '../../errors/app-error.js';
import { AuthResult } from './register.use-case.js';

export interface LoginInput {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: LoginInput): Promise<AuthResult> {
    const normalizedEmail = input.email.trim().toLowerCase();

    // Mensaje genérico para no revelar detalles de existencia ni contraseña
    const genericAuthError = new UnauthorizedError('Credenciales de acceso inválidas');

    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw genericAuthError;
    }

    // Regla 10: un usuario INACTIVE no puede iniciar sesión
    if (user.state === RecordState.INACTIVE) {
      throw genericAuthError;
    }

    const isPasswordValid = await this.passwordHasher.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw genericAuthError;
    }

    const token = this.tokenService.sign({
      sub: user.id,
      role: user.role,
    });

    const publicUser: PublicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return {
      user: publicUser,
      token,
    };
  }
}
