import { SuspectStatus, RecordState } from './enums.js';

export interface SuspectEntity {
  id: string;
  fullName: string;
  alias: string | null;
  description: string | null;
  suspicionLevel: number;
  status: SuspectStatus;
  photoUrl: string | null;
  state: RecordState;
  caseId: string;
  createdAt: Date;
  updatedAt: Date;
}
