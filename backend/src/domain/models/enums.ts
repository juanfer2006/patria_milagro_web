export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum RecordState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum CaseStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

export enum SuspectStatus {
  PERSON_OF_INTEREST = 'PERSON_OF_INTEREST',
  DETAINED = 'DETAINED',
  CLEARED = 'CLEARED',
}

export enum EvidenceType {
  PHYSICAL = 'PHYSICAL',
  DIGITAL = 'DIGITAL',
  DOCUMENT = 'DOCUMENT',
  TESTIMONY = 'TESTIMONY',
  FORENSIC = 'FORENSIC',
}
