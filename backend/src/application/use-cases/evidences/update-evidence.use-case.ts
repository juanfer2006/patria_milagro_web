import {
  IEvidenceRepository,
  ICaseRepository,
  ISuspectRepository,
  UpdateEvidenceData,
} from '../../../domain/repository/index.js';
import { Actor, EvidenceEntity } from '../../../domain/models/index.js';
import { assertCaseAccess } from '../../policies/case-access.policy.js';
import { NotFoundError, ValidationError } from '../../errors/app-error.js';
import { EvidenceResponse } from './create-evidence.use-case.js';

export class UpdateEvidenceUseCase {
  constructor(
    private readonly evidenceRepository: IEvidenceRepository,
    private readonly caseRepository: ICaseRepository,
    private readonly suspectRepository: ISuspectRepository,
  ) {}

  async execute(id: string, data: UpdateEvidenceData, actor: Actor): Promise<EvidenceResponse> {
    // 1. Cargar evidencia y verificar existencia
    const evidence = await this.evidenceRepository.findById(id);
    if (!evidence) {
      throw new NotFoundError('Evidencia no encontrada');
    }

    // 2. Cargar caso padre y validar acceso del actor
    const caseEntity = await this.caseRepository.findById(evidence.caseId);
    assertCaseAccess(caseEntity, actor);

    // NOTA: La regla 3 solo prohíbe CREAR en caso cerrado; editar y eliminar se permiten.

    // 3. Regla 4: Si se actualiza suspectId, debe pertenecer al mismo caseId
    if (data.suspectId) {
      const suspect = await this.suspectRepository.findById(data.suspectId);
      if (!suspect || suspect.caseId !== evidence.caseId) {
        throw new ValidationError('El sospechoso no pertenece al caso especificado o no existe');
      }
    }

    // 4. Validación de fecha no futura si viene en la actualización
    if (data.collectedAt && data.collectedAt.getTime() > Date.now() + 60000) {
      throw new ValidationError('La fecha de recolección no puede ser futura');
    }

    // 5. Validación de relevancia si viene en la actualización
    if (data.relevance !== undefined && (data.relevance < 1 || data.relevance > 5)) {
      throw new ValidationError('La relevancia debe ser un número entero entre 1 y 5');
    }

    // 6. Actualizar en el repositorio
    const updated = await this.evidenceRepository.update(id, data);

    return this.toResponse(updated);
  }

  private toResponse(entity: EvidenceEntity): EvidenceResponse {
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
