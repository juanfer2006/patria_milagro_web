import {
  ICaseRepository,
  CreateCaseData,
  UpdateCaseData,
  CaseFilters,
} from '../../domain/repository/index.js';
import { CaseEntity } from '../../domain/models/index.js';

export class PrismaCaseRepository implements ICaseRepository {
  async create(_data: CreateCaseData): Promise<CaseEntity> {
    throw new Error('PrismaCaseRepository.create no implementado (Rebanada B)');
  }

  async findById(_id: string): Promise<CaseEntity | null> {
    throw new Error('PrismaCaseRepository.findById no implementado (Rebanada B)');
  }

  async list(
    _filters: CaseFilters,
    _page: number,
    _limit: number,
  ): Promise<{ items: CaseEntity[]; total: number }> {
    throw new Error('PrismaCaseRepository.list no implementado (Rebanada B)');
  }

  async update(_id: string, _data: UpdateCaseData): Promise<CaseEntity> {
    throw new Error('PrismaCaseRepository.update no implementado (Rebanada B)');
  }

  async deactivateCascade(_id: string): Promise<void> {
    throw new Error('PrismaCaseRepository.deactivateCascade no implementado (Rebanada B)');
  }
}
