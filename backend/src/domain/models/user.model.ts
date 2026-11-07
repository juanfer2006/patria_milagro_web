import { Role, RecordState } from './enums.js';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  state: RecordState;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUser = Omit<UserEntity, 'passwordHash' | 'state' | 'updatedAt'>;
