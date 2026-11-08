import { ICaseRepository, UpdateCaseData } from '../../../domain/repository/index.js';
import { Actor, CaseStatus } from '../../../domain/models/index.js';
import { assertCaseAccess } from '../../policies/case-access.policy.js';
import { CaseResponse, toCaseResponse } from './case-response.js';

export interface UpdateCaseInput {
  title: string;
  description: string;
  location: string;
  incidentDate: Date;
  status?: CaseStatus;
  imageUrl?: string | null;
}

export class UpdateCaseUseCase {
  constructor(private readonly caseRepository: ICaseRepository) {}

  async execute(id: string, input: UpdateCaseInput, actor: Actor): Promise<CaseResponse> {
    const existingCase = await this.caseRepository.findById(id);

    assertCaseAccess(existingCase, actor);

    const updateData: UpdateCaseData = {
      title: input.title,
      description: input.description,
      location: input.location,
      incidentDate: input.incidentDate,
    };

    if (input.status !== undefined) {
      updateData.status = input.status;
    }

    if (input.imageUrl !== undefined) {
      updateData.imageUrl = input.imageUrl;
    }

    const updatedCase = await this.caseRepository.update(id, updateData);

    return toCaseResponse(updatedCase);
  }
}
