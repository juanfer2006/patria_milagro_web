import {
  IEvidenceRepository,
  CreateEvidenceData,
  UpdateEvidenceData,
  EvidenceFilters,
} from '../../domain/repository/index.js';
import { EvidenceEntity } from '../../domain/models/index.js';

export class PrismaEvidenceRepository implements IEvidenceRepository {
  async create(_data: CreateEvidenceData): Promise<EvidenceEntity> {
    throw new Error('PrismaEvidenceRepository.create no implementado (Rebanada D)');
  }

  async findById(_id: string): Promise<EvidenceEntity | null> {
    throw new Error('PrismaEvidenceRepository.findById no implementado (Rebanada D)');
  }

  async list(
    _filters: EvidenceFilters,
    _page: number,
    _limit: number,
  ): Promise<{ items: EvidenceEntity[]; total: number }> {
    throw new Error('PrismaEvidenceRepository.list no implementado (Rebanada D)');
  }

  async update(_id: string, _data: UpdateEvidenceData): Promise<EvidenceEntity> {
    throw new Error('PrismaEvidenceRepository.update no implementado (Rebanada D)');
  }

  async deactivate(_id: string): Promise<void> {
    throw new Error('PrismaEvidenceRepository.deactivate no implementado (Rebanada D)');
  }
}
