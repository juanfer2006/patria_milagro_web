import {
  IEvidenceRepository,
  ICaseRepository,
  EvidenceFilters,
} from '../../../domain/repository/index.js';
import { Actor, Role, EvidenceEntity } from '../../../domain/models/index.js';
import { Paginated, buildPagination } from '../../../infrastructure/dtos/pagination.dto.js';
import { EvidenceResponse } from './create-evidence.use-case.js';
import { assertCaseAccess } from '../../policies/case-access.policy.js';

export interface ListEvidencesInput {
  page: number;
  limit: number;
  filters: EvidenceFilters;
}

export class ListEvidencesUseCase {
  constructor(
    private readonly evidenceRepository: IEvidenceRepository,
    private readonly caseRepository?: ICaseRepository,
  ) {}

  async execute(input: ListEvidencesInput, actor: Actor): Promise<Paginated<EvidenceResponse>> {
    const filters: EvidenceFilters = {
      caseId: input.filters.caseId,
      suspectId: input.filters.suspectId,
      type: input.filters.type,
      q: input.filters.q,
    };

    if (actor.role === Role.ADMIN) {
      filters.ownerId = input.filters.ownerId;
    } else {
      // Un USER solo ve evidencias de sus propios casos
      filters.ownerId = actor.id;

      // Si se filtra por un caseId específico, verificar que el caso exista y sea accesible
      if (filters.caseId && this.caseRepository) {
        const caseEntity = await this.caseRepository.findById(filters.caseId);
        assertCaseAccess(caseEntity, actor);
      }
    }

    const { items, total } = await this.evidenceRepository.list(filters, input.page, input.limit);

    return {
      data: items.map(this.toResponse),
      pagination: buildPagination(total, input.page, input.limit),
    };
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
