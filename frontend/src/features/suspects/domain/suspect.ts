export enum SuspectStatus {
  PERSON_OF_INTEREST = 'PERSON_OF_INTEREST',
  DETAINED = 'DETAINED',
  CLEARED = 'CLEARED',
}

export const SUSPECT_STATUS_LABELS: Record<SuspectStatus, string> = {
  [SuspectStatus.PERSON_OF_INTEREST]: 'Persona de interés',
  [SuspectStatus.DETAINED]: 'Detenido',
  [SuspectStatus.CLEARED]: 'Descartado',
};

export const SUSPECT_STATUS_COLORS: Record<
  SuspectStatus,
  { bg: string; text: string; border: string }
> = {
  [SuspectStatus.PERSON_OF_INTEREST]: {
    bg: 'bg-alerta/10',
    text: 'text-alerta',
    border: 'border-alerta/40',
  },
  [SuspectStatus.DETAINED]: {
    bg: 'bg-evidencia/10',
    text: 'text-evidencia',
    border: 'border-evidencia/40',
  },
  [SuspectStatus.CLEARED]: {
    bg: 'bg-grafito-light/30',
    text: 'text-papel-muted',
    border: 'border-grafito-light',
  },
};

export interface Suspect {
  id: string;
  fullName: string;
  alias: string | null;
  description: string | null;
  suspicionLevel: number;
  status: SuspectStatus;
  photoUrl: string | null;
  caseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSuspectInput {
  caseId: string;
  fullName: string;
  alias?: string | null;
  description?: string | null;
  suspicionLevel?: number;
  status?: SuspectStatus;
  photoUrl?: string | null;
}

export interface UpdateSuspectInput {
  fullName?: string;
  alias?: string | null;
  description?: string | null;
  suspicionLevel?: number;
  status?: SuspectStatus;
  photoUrl?: string | null;
}

export interface SuspectFilters {
  caseId?: string;
  status?: SuspectStatus;
  q?: string;
}
