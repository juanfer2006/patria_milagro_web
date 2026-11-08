import { httpClient } from '../../common/http/http-client';
import { Paginated } from '../../common/domain/pagination';
import { Case, CaseStatus } from '../domain/case';

export interface CreateCasePayload {
  title: string;
  description: string;
  location: string;
  incidentDate: string;
  status?: CaseStatus;
  imageUrl?: string | null;
}

export interface UpdateCasePayload {
  title: string;
  description: string;
  location: string;
  incidentDate: string;
  status?: CaseStatus;
  imageUrl?: string | null;
}

export interface ListCasesParams {
  [key: string]: string | number | boolean | undefined | null;
  page?: number;
  limit?: number;
  q?: string;
  status?: CaseStatus;
  from?: string;
  to?: string;
  ownerId?: string;
}

export class CasesService {
  async list(params?: ListCasesParams): Promise<Paginated<Case>> {
    return httpClient.get<Paginated<Case>>('/cases', { params });
  }

  async getById(id: string): Promise<Case> {
    const response = await httpClient.get<{ data: Case }>(`/cases/${id}`);
    return response.data;
  }

  async create(payload: CreateCasePayload): Promise<Case> {
    const response = await httpClient.post<{ data: Case }>('/cases', payload);
    return response.data;
  }

  async update(id: string, payload: UpdateCasePayload): Promise<Case> {
    const response = await httpClient.put<{ data: Case }>(`/cases/${id}`, payload);
    return response.data;
  }

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/cases/${id}`);
  }
}

export const casesService = new CasesService();
