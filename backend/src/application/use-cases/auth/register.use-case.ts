import { IUserRepository } from '../../../domain/repository/index.js';
import { IPasswordHasher, ITokenService } from '../../../domain/services/index.js';
import { PublicUser, Role } from '../../../domain/models/index.js';
import { ConflictError } from '../../errors/app-error.js';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthResult {
  user: PublicUser;
  token: string;
}

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: RegisterInput): Promise<AuthResult> {
    const normalizedEmail = input.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new ConflictError('El correo electrónico ya se encuentra registrado');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    // El registro SIEMPRE crea rol USER según la regla de negocio
    const newUser = await this.userRepository.create({
      name: input.name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: Role.USER,
    });

    const token = this.tokenService.sign({
      sub: newUser.id,
      role: newUser.role,
    });

    const publicUser: PublicUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    return {
      user: publicUser,
      token,
    };
  }
}
