import { httpClient } from '../../common/http/http-client';
import { Paginated } from '../../common/domain/pagination';
import { Suspect, CreateSuspectInput, UpdateSuspectInput, SuspectFilters } from '../domain/suspect';

export const suspectsService = {
  async list(
    filters: SuspectFilters = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<Paginated<Suspect>> {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));

    if (filters.caseId) params.set('caseId', filters.caseId);
    if (filters.status) params.set('status', filters.status);
    if (filters.q) params.set('q', filters.q);

    return httpClient.get<Paginated<Suspect>>(`/suspects?${params.toString()}`);
  },

  async getById(id: string): Promise<Suspect> {
    const res = await httpClient.get<{ data: Suspect }>(`/suspects/${id}`);
    return res.data;
  },

  async create(input: CreateSuspectInput): Promise<Suspect> {
    const res = await httpClient.post<{ data: Suspect }>('/suspects', input);
    return res.data;
  },

  async update(id: string, input: UpdateSuspectInput): Promise<Suspect> {
    const res = await httpClient.put<{ data: Suspect }>(`/suspects/${id}`, input);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete<void>(`/suspects/${id}`);
  },
};
