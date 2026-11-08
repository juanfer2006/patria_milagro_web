import { ICaseRepository } from '../../../domain/repository/index.js';
import { Actor } from '../../../domain/models/index.js';
import { assertCaseAccess } from '../../policies/case-access.policy.js';

export class DeleteCaseUseCase {
  constructor(private readonly caseRepository: ICaseRepository) {}

  async execute(id: string, actor: Actor): Promise<void> {
    const existingCase = await this.caseRepository.findById(id);

    assertCaseAccess(existingCase, actor);

    await this.caseRepository.deactivateCascade(id);
  }
}
