import { PrismaClient, Prisma } from '@prisma/client';
import {
  ISuspectRepository,
  CreateSuspectData,
  UpdateSuspectData,
  SuspectFilters,
} from '../../domain/repository/index.js';
import { SuspectEntity, SuspectStatus, RecordState } from '../../domain/models/index.js';
import { prisma as defaultPrisma } from '../prisma/prisma-client.js';

export class PrismaSuspectRepository implements ISuspectRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  async create(data: CreateSuspectData): Promise<SuspectEntity> {
    const created = await this.prisma.suspect.create({
      data: {
        fullName: data.fullName,
        alias: data.alias ?? null,
        description: data.description ?? null,
        suspicionLevel: data.suspicionLevel ?? 0,
        status: data.status ?? SuspectStatus.PERSON_OF_INTEREST,
        photoUrl: data.photoUrl ?? null,
        caseId: data.caseId,
        state: RecordState.ACTIVE,
      },
    });

    return this.mapToDomain(created);
  }

  async findById(id: string): Promise<SuspectEntity | null> {
    const found = await this.prisma.suspect.findFirst({
      where: {
        id,
        state: RecordState.ACTIVE,
        case: {
          state: RecordState.ACTIVE,
        },
      },
    });

    return found ? this.mapToDomain(found) : null;
  }

  async list(
    filters: SuspectFilters,
    page: number,
    limit: number,
  ): Promise<{ items: SuspectEntity[]; total: number }> {
    const whereClause: Prisma.SuspectWhereInput = {
      state: RecordState.ACTIVE,
      case: {
        state: RecordState.ACTIVE,
      },
    };

    if (filters.ownerId) {
      whereClause.case = {
        state: RecordState.ACTIVE,
        ownerId: filters.ownerId,
      };
    }

    if (filters.caseId) {
      whereClause.caseId = filters.caseId;
    }

    if (filters.status) {
      whereClause.status = filters.status;
    }

    if (filters.q) {
      whereClause.OR = [
        { fullName: { contains: filters.q, mode: 'insensitive' } },
        { alias: { contains: filters.q, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.suspect.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.suspect.count({
        where: whereClause,
      }),
    ]);

    return {
      items: items.map((item) => this.mapToDomain(item)),
      total,
    };
  }

  async update(id: string, data: UpdateSuspectData): Promise<SuspectEntity> {
    const updated = await this.prisma.suspect.update({
      where: { id },
      data: {
        ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
        ...(data.alias !== undefined ? { alias: data.alias } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.suspicionLevel !== undefined ? { suspicionLevel: data.suspicionLevel } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.photoUrl !== undefined ? { photoUrl: data.photoUrl } : {}),
      },
    });

    return this.mapToDomain(updated);
  }

  async deactivateAndUnlinkEvidences(id: string): Promise<void> {
    await this.prisma.$transaction([
      // 1. Desvincular evidencias dejando suspectId en null (manteniéndolas ACTIVE)
      this.prisma.evidence.updateMany({
        where: { suspectId: id },
        data: { suspectId: null },
      }),
      // 2. Borrado lógico del sospechoso pasando su estado a INACTIVE
      this.prisma.suspect.update({
        where: { id },
        data: { state: RecordState.INACTIVE },
      }),
    ]);
  }

  private mapToDomain(raw: {
    id: string;
    fullName: string;
    alias: string | null;
    description: string | null;
    suspicionLevel: number;
    status: string;
    photoUrl: string | null;
    state: string;
    caseId: string;
    createdAt: Date;
    updatedAt: Date;
  }): SuspectEntity {
    return {
      id: raw.id,
      fullName: raw.fullName,
      alias: raw.alias,
      description: raw.description,
      suspicionLevel: raw.suspicionLevel,
      status: raw.status as SuspectStatus,
      photoUrl: raw.photoUrl,
      state: raw.state as RecordState,
      caseId: raw.caseId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
