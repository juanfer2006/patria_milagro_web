import { httpClient } from '../../common/http/http-client';
import { Paginated } from '../../common/domain/pagination';
import { User } from '../../auth/domain/user';

export interface ListUsersParams {
  [key: string]: string | number | boolean | null | undefined;
  page?: number;
  limit?: number;
  q?: string;
  role?: string;
}

export const adminService = {
  async listUsers(params?: ListUsersParams): Promise<Paginated<User>> {
    return httpClient.get<Paginated<User>>('/users', { params });
  },

  async deactivateUser(id: string): Promise<void> {
    return httpClient.delete(`/users/${id}`);
  },
};
