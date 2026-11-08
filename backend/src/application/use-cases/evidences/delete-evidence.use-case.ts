import { IEvidenceRepository, ICaseRepository } from '../../../domain/repository/index.js';
import { Actor } from '../../../domain/models/index.js';
import { assertCaseAccess } from '../../policies/case-access.policy.js';
import { NotFoundError } from '../../errors/app-error.js';

export class DeleteEvidenceUseCase {
  constructor(
    private readonly evidenceRepository: IEvidenceRepository,
    private readonly caseRepository: ICaseRepository,
  ) {}

  async execute(id: string, actor: Actor): Promise<void> {
    const evidence = await this.evidenceRepository.findById(id);
    if (!evidence) {
      throw new NotFoundError('Evidencia no encontrada');
    }

    const caseEntity = await this.caseRepository.findById(evidence.caseId);
    assertCaseAccess(caseEntity, actor);

    // Borrado lógico de la evidencia
    await this.evidenceRepository.deactivate(id);
  }
}
