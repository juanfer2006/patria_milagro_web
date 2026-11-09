import { httpClient } from '../../common/http/http-client';
import { Paginated } from '../../common/domain/pagination';
import { Evidence, EvidenceType } from '../domain/evidence';

export interface CreateEvidencePayload {
  caseId: string;
  suspectId?: string | null;
  title: string;
  description: string;
  type: EvidenceType;
  collectedAt: string;
  relevance: number;
  imageUrl?: string | null;
}

export interface UpdateEvidencePayload {
  suspectId?: string | null;
  title?: string;
  description?: string;
  type?: EvidenceType;
  collectedAt?: string;
  relevance?: number;
  imageUrl?: string | null;
}

export interface ListEvidencesParams {
  [key: string]: string | number | boolean | undefined | null;
  page?: number;
  limit?: number;
  caseId?: string;
  suspectId?: string;
  type?: EvidenceType;
  q?: string;
}

export class EvidencesService {
  async list(params?: ListEvidencesParams): Promise<Paginated<Evidence>> {
    return httpClient.get<Paginated<Evidence>>('/evidences', { params });
  }

  async listByCase(caseId: string): Promise<Evidence[]> {
    const result = await httpClient.get<Paginated<Evidence>>('/evidences', {
      params: { caseId, limit: 50 },
    });
    return result.data || [];
  }

  async getById(id: string): Promise<Evidence> {
    const response = await httpClient.get<{ data: Evidence }>(`/evidences/${id}`);
    return response.data;
  }

  async create(payload: CreateEvidencePayload): Promise<Evidence> {
    const response = await httpClient.post<{ data: Evidence }>('/evidences', payload);
    return response.data;
  }

  async update(id: string, payload: UpdateEvidencePayload): Promise<Evidence> {
    const response = await httpClient.put<{ data: Evidence }>(`/evidences/${id}`, payload);
    return response.data;
  }

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/evidences/${id}`);
  }
}

export const evidencesService = new EvidencesService();
