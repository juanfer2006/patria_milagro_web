export type CaseStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

export interface Case {
  id: string;
  caseNumber: number;
  title: string;
  description: string;
  location: string;
  incidentDate: string; // ISO string
  status: CaseStatus;
  imageUrl: string | null;
  ownerId: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En investigación',
  CLOSED: 'Cerrado',
};

export function formatCaseCode(caseNumber: number): string {
  return `CR-${caseNumber.toString().padStart(4, '0')}`;
}
