import { ICaseRepository } from '../../../domain/repository/index.js';
import { Actor } from '../../../domain/models/index.js';
import { assertCaseAccess } from '../../policies/case-access.policy.js';
import { CaseResponse, toCaseResponse } from './case-response.js';

export class GetCaseUseCase {
  constructor(private readonly caseRepository: ICaseRepository) {}

  async execute(id: string, actor: Actor): Promise<CaseResponse> {
    const caseEntity = await this.caseRepository.findById(id);

    assertCaseAccess(caseEntity, actor);

    return toCaseResponse(caseEntity);
  }
}
