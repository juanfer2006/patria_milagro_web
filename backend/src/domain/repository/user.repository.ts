import { UserEntity, Role } from '../models/index.js';

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  role?: Role;
}

export interface UserFilters {
  q?: string;
  role?: Role;
}

export interface IUserRepository {
  create(data: CreateUserData): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  list(
    filters: UserFilters,
    page: number,
    limit: number,
  ): Promise<{ items: UserEntity[]; total: number }>;
  deactivate(id: string): Promise<void>;
}
