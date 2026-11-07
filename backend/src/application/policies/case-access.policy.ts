import { CaseEntity, Actor, Role } from '../../domain/models/index.js';
import { NotFoundError } from '../errors/app-error.js';

/**
 * Valida si el actor tiene acceso al caso especificado.
 * Si el caso no existe o si el usuario no es ADMIN ni el propietario del caso,
 * se lanza un NotFoundError para no filtrar información sobre existencia de casos ajenos.
 */
export function assertCaseAccess(
  caseEntity: CaseEntity | null,
  actor: Actor,
): asserts caseEntity is CaseEntity {
  if (!caseEntity) {
    throw new NotFoundError('Caso no encontrado');
  }

  if (actor.role === Role.ADMIN) {
    return;
  }

  if (caseEntity.ownerId !== actor.id) {
    throw new NotFoundError('Caso no encontrado');
  }
}
