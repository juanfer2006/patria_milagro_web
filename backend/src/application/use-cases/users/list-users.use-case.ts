import { IUserRepository, UserFilters } from '../../../domain/repository/index.js';
import { PublicUser } from '../../../domain/models/index.js';
import { Paginated, buildPagination } from '../../../infrastructure/dtos/pagination.dto.js';

export interface ListUsersInput {
  page: number;
  limit: number;
  filters: UserFilters;
}

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: ListUsersInput): Promise<Paginated<PublicUser>> {
    const { items, total } = await this.userRepository.list(input.filters, input.page, input.limit);

    const publicUsers: PublicUser[] = items.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }));

    return {
      data: publicUsers,
      pagination: buildPagination(total, input.page, input.limit),
    };
  }
}
