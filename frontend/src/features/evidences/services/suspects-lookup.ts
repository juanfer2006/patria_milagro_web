import { httpClient } from '../../common/http/http-client';

export interface SuspectLookupOption {
  id: string;
  fullName: string;
  alias?: string | null;
}

/**
 * Consulta de apoyo para obtener los sospechosos asociados a un caso
 * Permite seleccionar el sospechoso vinculado al crear o editar una evidencia.
 */
export async function fetchCaseSuspectsLookup(caseId: string): Promise<SuspectLookupOption[]> {
  try {
    const response = await httpClient.get<{ data: SuspectLookupOption[] }>('/suspects', {
      params: { caseId, limit: 50 },
    });
    return response.data || [];
  } catch {
    // Si la rebanada C de sospechosos aún no está lista o no retorna datos
    return [];
  }
}
