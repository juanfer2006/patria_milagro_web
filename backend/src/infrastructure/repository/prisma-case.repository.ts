import { PrismaClient, Prisma } from '@prisma/client';
import {
  ICaseRepository,
  CreateCaseData,
  UpdateCaseData,
  CaseFilters,
} from '../../domain/repository/index.js';
import { CaseEntity, CaseStatus, RecordState } from '../../domain/models/index.js';
import { prisma as defaultPrisma } from '../prisma/prisma-client.js';

export class PrismaCaseRepository implements ICaseRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  async create(data: CreateCaseData): Promise<CaseEntity> {
    const created = await this.prisma.case.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        incidentDate: data.incidentDate,
        status: data.status ?? CaseStatus.OPEN,
        imageUrl: data.imageUrl ?? null,
        ownerId: data.ownerId,
        state: RecordState.ACTIVE,
      },
    });

    return this.mapToDomain(created);
  }

  async findById(id: string): Promise<CaseEntity | null> {
    const found = await this.prisma.case.findFirst({
      where: {
        id,
        state: RecordState.ACTIVE,
      },
    });

    return found ? this.mapToDomain(found) : null;
  }

  async list(
    filters: CaseFilters,
    page: number,
    limit: number,
  ): Promise<{ items: CaseEntity[]; total: number }> {
    const whereClause: Prisma.CaseWhereInput = {
      state: RecordState.ACTIVE,
    };

    if (filters.ownerId) {
      whereClause.ownerId = filters.ownerId;
    }

    if (filters.status) {
      whereClause.status = filters.status;
    }

    if (filters.from || filters.to) {
      const incidentDateFilter: Prisma.DateTimeFilter = {};
      if (filters.from) {
        incidentDateFilter.gte = filters.from;
      }
      if (filters.to) {
        incidentDateFilter.lte = filters.to;
      }
      whereClause.incidentDate = incidentDateFilter;
    }

    if (filters.q && filters.q.trim().length > 0) {
      const searchTerm = filters.q.trim();
      whereClause.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { location: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const [total, cases] = await Promise.all([
      this.prisma.case.count({ where: whereClause }),
      this.prisma.case.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ createdAt: 'desc' }, { caseNumber: 'desc' }],
      }),
    ]);

    return {
      items: cases.map((c) => this.mapToDomain(c)),
      total,
    };
  }

  async update(id: string, data: UpdateCaseData): Promise<CaseEntity> {
    const updateData: Prisma.CaseUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.incidentDate !== undefined) updateData.incidentDate = data.incidentDate;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

    const updated = await this.prisma.case.update({
      where: { id },
      data: updateData,
    });

    return this.mapToDomain(updated);
  }

  async deactivateCascade(id: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.evidence.updateMany({
        where: { caseId: id, state: RecordState.ACTIVE },
        data: { state: RecordState.INACTIVE },
      });

      await tx.suspect.updateMany({
        where: { caseId: id, state: RecordState.ACTIVE },
        data: { state: RecordState.INACTIVE },
      });

      await tx.case.update({
        where: { id },
        data: { state: RecordState.INACTIVE },
      });
    });
  }

  private mapToDomain(raw: {
    id: string;
    caseNumber: number;
    title: string;
    description: string;
    location: string;
    incidentDate: Date;
    status: string;
    imageUrl: string | null;
    state: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
  }): CaseEntity {
    return {
      id: raw.id,
      caseNumber: raw.caseNumber,
      title: raw.title,
      description: raw.description,
      location: raw.location,
      incidentDate: raw.incidentDate,
      status: raw.status as CaseStatus,
      imageUrl: raw.imageUrl,
      state: raw.state as RecordState,
      ownerId: raw.ownerId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
