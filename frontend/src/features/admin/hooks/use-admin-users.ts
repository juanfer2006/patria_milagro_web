'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '../../auth/domain/user';
import { adminService, ListUsersParams } from '../services/admin.service';
import { PaginationMeta } from '../../common/domain/pagination';
import { ApiError } from '../../common/domain/api-error';

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    currentPage: 1,
    limit: 10,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: ListUsersParams = {
        page: currentPage,
        limit: 10,
        q: searchQuery || undefined,
        role: roleFilter || undefined,
      };
      const response = await adminService.listUsers(params);
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || 'Error al obtener el listado de usuarios');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deactivateUser = async (id: string): Promise<void> => {
    try {
      await adminService.deactivateUser(id);
      await fetchUsers();
    } catch (err) {
      const apiErr = err as ApiError;
      throw new Error(apiErr.message || 'Error al desactivar el usuario');
    }
  };

  return {
    users,
    pagination,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    deactivateUser,
    refresh: fetchUsers,
  };
}
