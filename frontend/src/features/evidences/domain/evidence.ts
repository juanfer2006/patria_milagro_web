export type EvidenceType = 'PHYSICAL' | 'DIGITAL' | 'DOCUMENT' | 'TESTIMONY' | 'FORENSIC';

export interface Evidence {
  id: string;
  title: string;
  description: string;
  type: EvidenceType;
  collectedAt: string;
  relevance: number; // 1 to 5
  imageUrl: string | null;
  caseId: string;
  suspectId: string | null;
  createdAt: string;
  updatedAt: string;
}

export const EVIDENCE_TYPES: EvidenceType[] = [
  'PHYSICAL',
  'DIGITAL',
  'DOCUMENT',
  'TESTIMONY',
  'FORENSIC',
];

export const EvidenceTypeLabels: Record<EvidenceType, string> = {
  PHYSICAL: 'Física',
  DIGITAL: 'Digital',
  DOCUMENT: 'Documento',
  TESTIMONY: 'Testimonio',
  FORENSIC: 'Forense',
};

export const EvidenceTypeBadgeStyles: Record<
  EvidenceType,
  { bg: string; text: string; border: string }
> = {
  PHYSICAL: {
    bg: 'bg-amber-950/40',
    text: 'text-amber-300',
    border: 'border-amber-600/40',
  },
  DIGITAL: {
    bg: 'bg-blue-950/40',
    text: 'text-blue-300',
    border: 'border-blue-600/40',
  },
  DOCUMENT: {
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-300',
    border: 'border-emerald-600/40',
  },
  TESTIMONY: {
    bg: 'bg-purple-950/40',
    text: 'text-purple-300',
    border: 'border-purple-600/40',
  },
  FORENSIC: {
    bg: 'bg-red-950/40',
    text: 'text-red-300',
    border: 'border-red-600/40',
  },
};

export const RelevanceDescriptions: Record<number, string> = {
  1: 'Mínima / Circunstancial',
  2: 'Baja / De apoyo',
  3: 'Media / Significativa',
  4: 'Alta / Clave',
  5: 'Crítica / Determinante',
};

export function formatEvidenceDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}
