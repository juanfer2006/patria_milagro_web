import { ICaseRepository, CaseFilters } from '../../../domain/repository/index.js';
import { Actor, Role } from '../../../domain/models/index.js';
import { Paginated, buildPagination } from '../../../infrastructure/dtos/pagination.dto.js';
import { CaseResponse, toCaseResponse } from './case-response.js';

export interface ListCasesInput {
  page: number;
  limit: number;
  filters: CaseFilters;
}

export class ListCasesUseCase {
  constructor(private readonly caseRepository: ICaseRepository) {}

  async execute(input: ListCasesInput, actor: Actor): Promise<Paginated<CaseResponse>> {
    const filters: CaseFilters = {
      q: input.filters.q,
      status: input.filters.status,
      from: input.filters.from,
      to: input.filters.to,
    };

    if (actor.role === Role.ADMIN) {
      filters.ownerId = input.filters.ownerId;
    } else {
      // Un USER solo ve sus propios casos; se ignora cualquier ownerId enviado en query
      filters.ownerId = actor.id;
    }

    const { items, total } = await this.caseRepository.list(filters, input.page, input.limit);

    return {
      data: items.map(toCaseResponse),
      pagination: buildPagination(total, input.page, input.limit),
    };
  }
}
