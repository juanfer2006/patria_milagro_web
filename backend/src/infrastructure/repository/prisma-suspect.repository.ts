import {
  ISuspectRepository,
  CreateSuspectData,
  UpdateSuspectData,
  SuspectFilters,
} from '../../domain/repository/index.js';
import { SuspectEntity } from '../../domain/models/index.js';

export class PrismaSuspectRepository implements ISuspectRepository {
  async create(_data: CreateSuspectData): Promise<SuspectEntity> {
    throw new Error('PrismaSuspectRepository.create no implementado (Rebanada C)');
  }

  async findById(_id: string): Promise<SuspectEntity | null> {
    throw new Error('PrismaSuspectRepository.findById no implementado (Rebanada C)');
  }

  async list(
    _filters: SuspectFilters,
    _page: number,
    _limit: number,
  ): Promise<{ items: SuspectEntity[]; total: number }> {
    throw new Error('PrismaSuspectRepository.list no implementado (Rebanada C)');
  }

  async update(_id: string, _data: UpdateSuspectData): Promise<SuspectEntity> {
    throw new Error('PrismaSuspectRepository.update no implementado (Rebanada C)');
  }

  async deactivateAndUnlinkEvidences(_id: string): Promise<void> {
    throw new Error(
      'PrismaSuspectRepository.deactivateAndUnlinkEvidences no implementado (Rebanada C)',
    );
  }
}
