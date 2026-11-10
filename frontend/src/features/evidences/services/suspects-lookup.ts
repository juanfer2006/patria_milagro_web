import { suspectsService, Suspect } from '../../suspects';

export type SuspectLookupOption = Suspect;

/**
 * Consulta oficial de sospechosos utilizando el servicio suspectsService
 * de la feature suspects (Rebanada C) para permitir asociar sospechosos
 * a evidencias forenses del caso.
 */
export async function fetchCaseSuspectsLookup(caseId: string): Promise<SuspectLookupOption[]> {
  try {
    const response = await suspectsService.list({ caseId }, 1, 50);
    return response.data || [];
  } catch {
    return [];
  }
}
