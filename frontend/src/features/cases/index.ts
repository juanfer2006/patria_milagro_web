export type { Case, CaseStatus } from './domain/case';
export { CASE_STATUS_LABELS, formatCaseCode } from './domain/case';

export { casesService } from './services/cases.service';
export type {
  CreateCasePayload,
  UpdateCasePayload,
  ListCasesParams,
} from './services/cases.service';

export { useCases } from './hooks/use-cases';
export type { UseCasesFilters } from './hooks/use-cases';
export { useCase } from './hooks/use-case';

export { CasesList } from './components/CasesList';
export type { CasesListProps } from './components/CasesList';
export { CaseCard } from './components/CaseCard';
export { CaseStatusBadge } from './components/CaseStatusBadge';
export { CaseFilters } from './components/CaseFilters';
export { CaseForm } from './components/CaseForm';
export { CaseDetailView } from './components/CaseDetailView';
