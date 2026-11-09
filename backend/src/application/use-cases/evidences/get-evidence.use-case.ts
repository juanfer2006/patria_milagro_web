import { IEvidenceRepository, ICaseRepository } from '../../../domain/repository/index.js';
import { Actor, EvidenceEntity } from '../../../domain/models/index.js';
import { assertCaseAccess } from '../../policies/case-access.policy.js';
import { NotFoundError } from '../../errors/app-error.js';
import { EvidenceResponse } from './create-evidence.use-case.js';

export class GetEvidenceUseCase {
  constructor(
    private readonly evidenceRepository: IEvidenceRepository,
    private readonly caseRepository: ICaseRepository,
  ) {}

  async execute(id: string, actor: Actor): Promise<EvidenceResponse> {
    const evidence = await this.evidenceRepository.findById(id);
    if (!evidence) {
      throw new NotFoundError('Evidencia no encontrada');
    }

    const caseEntity = await this.caseRepository.findById(evidence.caseId);
    assertCaseAccess(caseEntity, actor);

    return this.toResponse(evidence);
  }

  private toResponse(entity: EvidenceEntity): EvidenceResponse {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      type: entity.type,
      collectedAt: entity.collectedAt,
      relevance: entity.relevance,
      imageUrl: entity.imageUrl,
      caseId: entity.caseId,
      suspectId: entity.suspectId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
