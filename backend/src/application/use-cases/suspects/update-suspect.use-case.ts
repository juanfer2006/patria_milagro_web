import {
  ISuspectRepository,
  ICaseRepository,
  UpdateSuspectData,
} from '../../../domain/repository/index.js';
import { Actor } from '../../../domain/models/index.js';
import { assertCaseAccess } from '../../policies/case-access.policy.js';
import { NotFoundError, ValidationError } from '../../errors/app-error.js';
import { SuspectResponse } from './create-suspect.use-case.js';

export class UpdateSuspectUseCase {
  constructor(
    private readonly suspectRepository: ISuspectRepository,
    private readonly caseRepository: ICaseRepository,
  ) {}

  async execute(id: string, data: UpdateSuspectData, actor: Actor): Promise<SuspectResponse> {
    const suspect = await this.suspectRepository.findById(id);
    if (!suspect) {
      throw new NotFoundError('Sospechoso no encontrado o inactivo');
    }

    // Regla 2: Sospechosos heredan la propiedad del caso
    const caseEntity = await this.caseRepository.findById(suspect.caseId);
    assertCaseAccess(caseEntity, actor);

    // Regla: En caso cerrado se permite editar sospechosos (la regla 3 solo prohíbe crear)
    if (data.suspicionLevel !== undefined) {
      if (data.suspicionLevel < 0 || data.suspicionLevel > 100) {
        throw new ValidationError('El nivel de sospecha debe estar entre 0 y 100');
      }
    }

    const updated = await this.suspectRepository.update(id, data);

    return {
      id: updated.id,
      fullName: updated.fullName,
      alias: updated.alias,
      description: updated.description,
      suspicionLevel: updated.suspicionLevel,
      status: updated.status,
      photoUrl: updated.photoUrl,
      caseId: updated.caseId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
