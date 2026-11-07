import { IUserRepository } from '../../../domain/repository/index.js';
import { Actor } from '../../../domain/models/index.js';
import { ConflictError, NotFoundError } from '../../errors/app-error.js';

export class DeactivateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(targetUserId: string, currentActor: Actor): Promise<void> {
    // Regla 9: El admin no puede desactivarse a sí mismo (409)
    if (targetUserId === currentActor.id) {
      throw new ConflictError('No está permitido desactivar su propia cuenta de administrador');
    }

    const user = await this.userRepository.findById(targetUserId);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    await this.userRepository.deactivate(targetUserId);
  }
}
