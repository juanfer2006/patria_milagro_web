import { SuspectEntity, SuspectStatus } from '../models/index.js';

export interface CreateSuspectData {
  caseId: string;
  fullName: string;
  alias?: string | null;
  description?: string | null;
  suspicionLevel?: number;
  status?: SuspectStatus;
  photoUrl?: string | null;
}

export interface UpdateSuspectData {
  fullName?: string;
  alias?: string | null;
  description?: string | null;
  suspicionLevel?: number;
  status?: SuspectStatus;
  photoUrl?: string | null;
}

export interface SuspectFilters {
  caseId?: string;
  ownerId?: string;
  status?: SuspectStatus;
  q?: string;
}

export interface ISuspectRepository {
  create(data: CreateSuspectData): Promise<SuspectEntity>;
  findById(id: string): Promise<SuspectEntity | null>;
  list(
    filters: SuspectFilters,
    page: number,
    limit: number,
  ): Promise<{ items: SuspectEntity[]; total: number }>;
  update(id: string, data: UpdateSuspectData): Promise<SuspectEntity>;
  deactivateAndUnlinkEvidences(id: string): Promise<void>;
}
