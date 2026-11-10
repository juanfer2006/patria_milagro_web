import { ISuspectRepository, ICaseRepository } from '../../../domain/repository/index.js';
import { Actor } from '../../../domain/models/index.js';
import { assertCaseAccess } from '../../policies/case-access.policy.js';
import { NotFoundError } from '../../errors/app-error.js';

export class DeleteSuspectUseCase {
  constructor(
    private readonly suspectRepository: ISuspectRepository,
    private readonly caseRepository: ICaseRepository,
  ) {}

  async execute(id: string, actor: Actor): Promise<void> {
    const suspect = await this.suspectRepository.findById(id);
    if (!suspect) {
      throw new NotFoundError('Sospechoso no encontrado o inactivo');
    }

    // Regla 2: Sospechosos heredan la propiedad del caso
    const caseEntity = await this.caseRepository.findById(suspect.caseId);
    assertCaseAccess(caseEntity, actor);

    // Regla 7: Eliminar un sospechoso desactiva y deja en null el suspectId de sus evidencias en una transacción
    await this.suspectRepository.deactivateAndUnlinkEvidences(id);
  }
}
