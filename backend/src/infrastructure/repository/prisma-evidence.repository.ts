import { PrismaClient, Prisma } from '@prisma/client';
import {
  IEvidenceRepository,
  CreateEvidenceData,
  UpdateEvidenceData,
  EvidenceFilters,
} from '../../domain/repository/index.js';
import { EvidenceEntity, EvidenceType, RecordState } from '../../domain/models/index.js';
import { prisma as defaultPrisma } from '../prisma/prisma-client.js';

export class PrismaEvidenceRepository implements IEvidenceRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  async create(data: CreateEvidenceData): Promise<EvidenceEntity> {
    const created = await this.prisma.evidence.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        collectedAt: data.collectedAt,
        relevance: data.relevance,
        imageUrl: data.imageUrl ?? null,
        caseId: data.caseId,
        suspectId: data.suspectId ?? null,
        state: RecordState.ACTIVE,
      },
    });

    return this.mapToDomain(created);
  }

  async findById(id: string): Promise<EvidenceEntity | null> {
    const found = await this.prisma.evidence.findFirst({
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
    filters: EvidenceFilters,
    page: number,
    limit: number,
  ): Promise<{ items: EvidenceEntity[]; total: number }> {
    const whereClause: Prisma.EvidenceWhereInput = {
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

    if (filters.suspectId) {
      whereClause.suspectId = filters.suspectId;
    }

    if (filters.type) {
      whereClause.type = filters.type;
    }

    if (filters.q && filters.q.trim().length > 0) {
      const searchTerm = filters.q.trim();
      whereClause.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const [total, evidences] = await Promise.all([
      this.prisma.evidence.count({ where: whereClause }),
      this.prisma.evidence.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ collectedAt: 'desc' }, { createdAt: 'desc' }],
      }),
    ]);

    return {
      items: evidences.map((e) => this.mapToDomain(e)),
      total,
    };
  }

  async update(id: string, data: UpdateEvidenceData): Promise<EvidenceEntity> {
    const updateData: Prisma.EvidenceUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.collectedAt !== undefined) updateData.collectedAt = data.collectedAt;
    if (data.relevance !== undefined) updateData.relevance = data.relevance;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.suspectId !== undefined) {
      if (data.suspectId === null) {
        updateData.suspect = { disconnect: true };
      } else {
        updateData.suspect = { connect: { id: data.suspectId } };
      }
    }

    const updated = await this.prisma.evidence.update({
      where: { id },
      data: updateData,
    });

    return this.mapToDomain(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.prisma.evidence.update({
      where: { id },
      data: { state: RecordState.INACTIVE },
    });
  }

  private mapToDomain(raw: {
    id: string;
    title: string;
    description: string;
    type: string;
    collectedAt: Date;
    relevance: number;
    imageUrl: string | null;
    state: string;
    caseId: string;
    suspectId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): EvidenceEntity {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      type: raw.type as EvidenceType,
      collectedAt: raw.collectedAt,
      relevance: raw.relevance,
      imageUrl: raw.imageUrl,
      state: raw.state as RecordState,
      caseId: raw.caseId,
      suspectId: raw.suspectId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
