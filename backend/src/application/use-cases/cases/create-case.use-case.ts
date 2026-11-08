import { ICaseRepository } from '../../../domain/repository/index.js';
import { Actor, CaseStatus } from '../../../domain/models/index.js';
import { CaseResponse, toCaseResponse } from './case-response.js';

export interface CreateCaseInput {
  title: string;
  description: string;
  location: string;
  incidentDate: Date;
  status?: CaseStatus;
  imageUrl?: string | null;
}

export class CreateCaseUseCase {
  constructor(private readonly caseRepository: ICaseRepository) {}

  async execute(input: CreateCaseInput, actor: Actor): Promise<CaseResponse> {
    const createdCase = await this.caseRepository.create({
      title: input.title,
      description: input.description,
      location: input.location,
      incidentDate: input.incidentDate,
      status: input.status ?? CaseStatus.OPEN,
      imageUrl: input.imageUrl ?? null,
      ownerId: actor.id,
    });

    return toCaseResponse(createdCase);
  }
}
