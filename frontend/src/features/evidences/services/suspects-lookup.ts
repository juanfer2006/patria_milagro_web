import { suspectsService, Suspect } from '../../suspects';

export type SuspectLookupOption = Suspect;

/**
 * Consulta oficial de sospechosos utilizando el servicio suspectsService
 * de la feature suspects (Rebanada C) para permitir asociar sospechosos
 * a evidencias forenses del caso.
 */
export async function fetchCaseSuspectsLookup(caseId: string): Promise<SuspectLookupOption[]> {
  if (!caseId) return [];
  try {
    const response = (await suspectsService.list({ caseId }, 1, 50)) as unknown;
    if (Array.isArray(response)) {
      return response as SuspectLookupOption[];
    }
    if (response && typeof response === 'object') {
      const record = response as Record<string, unknown>;
      if (Array.isArray(record.data)) {
        return record.data as SuspectLookupOption[];
      }
      if (Array.isArray(record.items)) {
        return record.items as SuspectLookupOption[];
      }
    }
    return [];
  } catch (err) {
    console.error('Error al obtener lista de sospechosos del caso para evidencias:', err);
    return [];
  }
}
