import {
  ISuspectRepository,
  ICaseRepository,
  SuspectFilters,
} from '../../../domain/repository/index.js';
import { Actor, Role } from '../../../domain/models/index.js';
import { assertCaseAccess } from '../../policies/case-access.policy.js';
import { SuspectResponse } from './create-suspect.use-case.js';

export interface ListSuspectsResult {
  items: SuspectResponse[];
  total: number;
}

export class ListSuspectsUseCase {
  constructor(
    private readonly suspectRepository: ISuspectRepository,
    private readonly caseRepository: ICaseRepository,
  ) {}

  async execute(
    filters: SuspectFilters,
    page: number,
    limit: number,
    actor: Actor,
  ): Promise<ListSuspectsResult> {
    const effectiveFilters: SuspectFilters = { ...filters };

    // Si se especifica caseId, validar acceso al caso
    if (filters.caseId) {
      const caseEntity = await this.caseRepository.findById(filters.caseId);
      assertCaseAccess(caseEntity, actor);
    } else if (actor.role !== Role.ADMIN) {
      // Un USER solo ve sospechosos de sus casos (regla 1 y punto 7 de filtros)
      effectiveFilters.ownerId = actor.id;
    }

    const { items, total } = await this.suspectRepository.list(effectiveFilters, page, limit);

    return {
      items: items.map((entity) => ({
        id: entity.id,
        fullName: entity.fullName,
        alias: entity.alias,
        description: entity.description,
        suspicionLevel: entity.suspicionLevel,
        status: entity.status,
        photoUrl: entity.photoUrl,
        caseId: entity.caseId,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      })),
      total,
    };
  }
}
