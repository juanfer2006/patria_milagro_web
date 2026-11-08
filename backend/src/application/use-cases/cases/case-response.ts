import { CaseEntity, CaseStatus } from '../../../domain/models/index.js';

export interface CaseResponse {
  id: string;
  caseNumber: number;
  title: string;
  description: string;
  location: string;
  incidentDate: Date;
  status: CaseStatus;
  imageUrl: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export function toCaseResponse(entity: CaseEntity): CaseResponse {
  return {
    id: entity.id,
    caseNumber: entity.caseNumber,
    title: entity.title,
    description: entity.description,
    location: entity.location,
    incidentDate: entity.incidentDate,
    status: entity.status,
    imageUrl: entity.imageUrl,
    ownerId: entity.ownerId,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
