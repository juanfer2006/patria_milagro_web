import { EvidenceEntity, EvidenceType } from '../models/index.js';

export interface CreateEvidenceData {
  caseId: string;
  suspectId?: string | null;
  title: string;
  description: string;
  type: EvidenceType;
  collectedAt: Date;
  relevance: number;
  imageUrl?: string | null;
}

export interface UpdateEvidenceData {
  suspectId?: string | null;
  title?: string;
  description?: string;
  type?: EvidenceType;
  collectedAt?: Date;
  relevance?: number;
  imageUrl?: string | null;
}

export interface EvidenceFilters {
  caseId?: string;
  ownerId?: string;
  suspectId?: string;
  type?: EvidenceType;
  q?: string;
}

export interface IEvidenceRepository {
  create(data: CreateEvidenceData): Promise<EvidenceEntity>;
  findById(id: string): Promise<EvidenceEntity | null>;
  list(
    filters: EvidenceFilters,
    page: number,
    limit: number,
  ): Promise<{ items: EvidenceEntity[]; total: number }>;
  update(id: string, data: UpdateEvidenceData): Promise<EvidenceEntity>;
  deactivate(id: string): Promise<void>;
}
