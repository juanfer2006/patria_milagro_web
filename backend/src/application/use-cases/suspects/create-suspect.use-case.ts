import {
  ISuspectRepository,
  ICaseRepository,
  CreateSuspectData,
} from '../../../domain/repository/index.js';
import { SuspectEntity, Actor, CaseStatus, SuspectStatus } from '../../../domain/models/index.js';
import { assertCaseAccess } from '../../policies/case-access.policy.js';
import { ConflictError, ValidationError } from '../../errors/app-error.js';

export interface SuspectResponse {
  id: string;
  fullName: string;
  alias: string | null;
  description: string | null;
  suspicionLevel: number;
  status: SuspectStatus;
  photoUrl: string | null;
  caseId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateSuspectUseCase {
  constructor(
    private readonly suspectRepository: ISuspectRepository,
    private readonly caseRepository: ICaseRepository,
  ) {}

  async execute(data: CreateSuspectData, actor: Actor): Promise<SuspectResponse> {
    // 1. Validar acceso al caso padre (404 si no existe o es ajeno a USER)
    const caseEntity = await this.caseRepository.findById(data.caseId);
    assertCaseAccess(caseEntity, actor);

    // 2. Regla 3: Si el caso está CLOSED no se pueden crear sospechosos (409)
    if (caseEntity.status === CaseStatus.CLOSED) {
      throw new ConflictError('No se pueden registrar sospechosos en un caso cerrado');
    }

    // 3. Validar nivel de sospecha entre 0 y 100
    const suspicionLevel = data.suspicionLevel ?? 0;
    if (suspicionLevel < 0 || suspicionLevel > 100) {
      throw new ValidationError('El nivel de sospecha debe estar entre 0 y 100');
    }

    // 4. Persistir sospechoso
    const created = await this.suspectRepository.create({
      ...data,
      suspicionLevel,
      status: data.status ?? SuspectStatus.PERSON_OF_INTEREST,
    });

    return this.sanitizeOutput(created);
  }

  private sanitizeOutput(entity: SuspectEntity): SuspectResponse {
    return {
      id: entity.id,
      fullName: entity.fullName,
      alias: entity.alias,
      description: entity.description,
      suspicionLevel: entity.suspicionLevel,
      status: entity.status,
      photoUrl: entity.photoUrl,
      caseId: entity.caseId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
