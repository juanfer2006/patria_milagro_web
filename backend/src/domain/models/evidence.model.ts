import { EvidenceType, RecordState } from './enums.js';

export interface EvidenceEntity {
  id: string;
  title: string;
  description: string;
  type: EvidenceType;
  collectedAt: Date;
  relevance: number;
  imageUrl: string | null;
  state: RecordState;
  caseId: string;
  suspectId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
