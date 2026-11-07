import { describe, it, expect } from 'vitest';
import { assertCaseAccess } from '../src/application/policies/case-access.policy.js';
import { CaseEntity, CaseStatus, RecordState, Role, Actor } from '../src/domain/models/index.js';
import { NotFoundError } from '../src/application/errors/app-error.js';

describe('Policy: assertCaseAccess', () => {
  const sampleCase: CaseEntity = {
    id: 'case-123',
    caseNumber: 1,
    title: 'Homicidio en callejón',
    description: 'Investigación en curso de incidente nocturno',
    location: 'Sector Norte',
    incidentDate: new Date('2026-11-01'),
    status: CaseStatus.OPEN,
    imageUrl: null,
    state: RecordState.ACTIVE,
    ownerId: 'owner-user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('debe permitir acceso al propietario del caso (rol USER)', () => {
    const actor: Actor = { id: 'owner-user-id', role: Role.USER };
    expect(() => assertCaseAccess(sampleCase, actor)).not.toThrow();
  });

  it('debe permitir acceso a un ADMIN independientemente de quién sea el dueño', () => {
    const adminActor: Actor = { id: 'admin-diff-id', role: Role.ADMIN };
    expect(() => assertCaseAccess(sampleCase, adminActor)).not.toThrow();
  });

  it('debe lanzar NotFoundError (404) si el usuario es USER y no es el dueño (Regla 1)', () => {
    const intruderActor: Actor = { id: 'intruder-user-id', role: Role.USER };
    expect(() => assertCaseAccess(sampleCase, intruderActor)).toThrow(NotFoundError);
  });

  it('debe lanzar NotFoundError (404) si el caso es null', () => {
    const actor: Actor = { id: 'owner-user-id', role: Role.USER };
    expect(() => assertCaseAccess(null, actor)).toThrow(NotFoundError);
  });
});
