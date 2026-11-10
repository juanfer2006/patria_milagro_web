import { ISuspectRepository, ICaseRepository } from '../../../domain/repository/index.js';
import { Actor } from '../../../domain/models/index.js';
import { assertCaseAccess } from '../../policies/case-access.policy.js';
import { NotFoundError } from '../../errors/app-error.js';
import { SuspectResponse } from './create-suspect.use-case.js';

export class GetSuspectUseCase {
  constructor(
    private readonly suspectRepository: ISuspectRepository,
    private readonly caseRepository: ICaseRepository,
  ) {}

  async execute(id: string, actor: Actor): Promise<SuspectResponse> {
    const suspect = await this.suspectRepository.findById(id);
    if (!suspect) {
      throw new NotFoundError('Sospechoso no encontrado o inactivo');
    }

    // Regla 2: Sospechosos heredan la propiedad del caso
    const caseEntity = await this.caseRepository.findById(suspect.caseId);
    assertCaseAccess(caseEntity, actor);

    return {
      id: suspect.id,
      fullName: suspect.fullName,
      alias: suspect.alias,
      description: suspect.description,
      suspicionLevel: suspect.suspicionLevel,
      status: suspect.status,
      photoUrl: suspect.photoUrl,
      caseId: suspect.caseId,
      createdAt: suspect.createdAt,
      updatedAt: suspect.updatedAt,
    };
  }
}
