import { IUserRepository } from '../../../domain/repository/index.js';
import { PublicUser } from '../../../domain/models/index.js';
import { NotFoundError } from '../../errors/app-error.js';

export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<PublicUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado o inactivo');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
