import { CaseEntity, CaseStatus } from '../models/index.js';

export interface CreateCaseData {
  title: string;
  description: string;
  location: string;
  incidentDate: Date;
  status?: CaseStatus;
  imageUrl?: string | null;
  ownerId: string;
}

export interface UpdateCaseData {
  title?: string;
  description?: string;
  location?: string;
  incidentDate?: Date;
  status?: CaseStatus;
  imageUrl?: string | null;
}

export interface CaseFilters {
  ownerId?: string;
  q?: string;
  status?: CaseStatus;
  from?: Date;
  to?: Date;
}

export interface ICaseRepository {
  create(data: CreateCaseData): Promise<CaseEntity>;
  findById(id: string): Promise<CaseEntity | null>;
  list(
    filters: CaseFilters,
    page: number,
    limit: number,
  ): Promise<{ items: CaseEntity[]; total: number }>;
  update(id: string, data: UpdateCaseData): Promise<CaseEntity>;
  deactivateCascade(id: string): Promise<void>;
}
