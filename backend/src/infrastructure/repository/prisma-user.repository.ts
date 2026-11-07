import { PrismaClient } from '@prisma/client';
import { IUserRepository, CreateUserData, UserFilters } from '../../domain/repository/index.js';
import { UserEntity, RecordState, Role } from '../../domain/models/index.js';
import { prisma as defaultPrisma } from '../prisma/prisma-client.js';

export class PrismaUserRepository implements IUserRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role ?? Role.USER,
        state: RecordState.ACTIVE,
      },
    });

    return this.mapToDomain(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    // Devuelve en cualquier estado para permitir validación en login
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.mapToDomain(user) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    // Solo registros ACTIVE según la regla de borrado lógico
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        state: RecordState.ACTIVE,
      },
    });

    return user ? this.mapToDomain(user) : null;
  }

  async list(
    filters: UserFilters,
    page: number,
    limit: number,
  ): Promise<{ items: UserEntity[]; total: number }> {
    const whereClause: {
      state: RecordState;
      role?: Role;
      OR?: Array<
        | { name: { contains: string; mode: 'insensitive' } }
        | { email: { contains: string; mode: 'insensitive' } }
      >;
    } = {
      state: RecordState.ACTIVE,
    };

    if (filters.role) {
      whereClause.role = filters.role;
    }

    if (filters.q && filters.q.trim().length > 0) {
      const searchTerm = filters.q.trim();
      whereClause.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where: whereClause }),
      this.prisma.user.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items: users.map((u) => this.mapToDomain(u)),
      total,
    };
  }

  async deactivate(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { state: RecordState.INACTIVE },
    });
  }

  private mapToDomain(raw: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    state: string;
    createdAt: Date;
    updatedAt: Date;
  }): UserEntity {
    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      passwordHash: raw.passwordHash,
      role: raw.role as Role,
      state: raw.state as RecordState,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
