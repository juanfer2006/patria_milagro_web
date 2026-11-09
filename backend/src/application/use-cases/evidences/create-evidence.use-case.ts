import {
  IEvidenceRepository,
  ICaseRepository,
  ISuspectRepository,
  CreateEvidenceData,
} from '../../../domain/repository/index.js';
import { EvidenceEntity, Actor, CaseStatus } from '../../../domain/models/index.js';
import { assertCaseAccess } from '../../policies/case-access.policy.js';
import { ConflictError, ValidationError } from '../../errors/app-error.js';

export interface EvidenceResponse {
  id: string;
  title: string;
  description: string;
  type: string;
  collectedAt: Date;
  relevance: number;
  imageUrl: string | null;
  caseId: string;
  suspectId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateEvidenceUseCase {
  constructor(
    private readonly evidenceRepository: IEvidenceRepository,
    private readonly caseRepository: ICaseRepository,
    private readonly suspectRepository: ISuspectRepository,
  ) {}

  async execute(data: CreateEvidenceData, actor: Actor): Promise<EvidenceResponse> {
    // 1. Validar acceso al caso padre
    const caseEntity = await this.caseRepository.findById(data.caseId);
    assertCaseAccess(caseEntity, actor);

    // 2. Regla 3: Si el caso está CLOSED no se pueden crear evidencias (409)
    if (caseEntity.status === CaseStatus.CLOSED) {
      throw new ConflictError('No se pueden registrar evidencias en un caso cerrado');
    }

    // 3. Regla 4: El suspectId de una evidencia debe pertenecer al mismo caseId (400)
    if (data.suspectId) {
      const suspect = await this.suspectRepository.findById(data.suspectId);
      if (!suspect || suspect.caseId !== data.caseId) {
        throw new ValidationError('El sospechoso no pertenece al caso especificado o no existe');
      }
    }

    // 4. Fecha de recolección no puede ser futura (400)
    if (data.collectedAt.getTime() > Date.now() + 60000) {
      throw new ValidationError('La fecha de recolección no puede ser futura');
    }

    // 5. Relevancia entre 1 y 5 (400)
    if (data.relevance < 1 || data.relevance > 5) {
      throw new ValidationError('La relevancia debe ser un número entero entre 1 y 5');
    }

    // 6. Persistir evidencia
    const created = await this.evidenceRepository.create(data);

    return this.sanitizeOutput(created);
  }

  private sanitizeOutput(entity: EvidenceEntity): EvidenceResponse {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      type: entity.type,
      collectedAt: entity.collectedAt,
      relevance: entity.relevance,
      imageUrl: entity.imageUrl,
      caseId: entity.caseId,
      suspectId: entity.suspectId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
