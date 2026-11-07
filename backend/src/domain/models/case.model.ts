import { CaseStatus, RecordState } from './enums.js';

export interface CaseEntity {
  id: string;
  caseNumber: number;
  title: string;
  description: string;
  location: string;
  incidentDate: Date;
  status: CaseStatus;
  imageUrl: string | null;
  state: RecordState;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export function formatCaseNumber(caseNumber: number): string {
  return `CR-${caseNumber.toString().padStart(4, '0')}`;
}
