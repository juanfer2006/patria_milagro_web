import { ApiError } from '../../common/domain/api-error';

export interface FieldErrors {
  [fieldName: string]: string;
}

/**
 * Normaliza los errores de la API quitando prefijos como body., params. o query.
 * y genera un mapa de campo -> mensaje de error para los formularios.
 */
export function normalizeApiFieldErrors(error: ApiError | null): {
  generalMessage: string | null;
  fieldErrors: FieldErrors;
} {
  if (!error) {
    return { generalMessage: null, fieldErrors: {} };
  }

  const fieldErrors: FieldErrors = {};

  if (error.details && Array.isArray(error.details)) {
    for (const detail of error.details) {
      if (detail.field) {
        // Quita prefijos body., params., query.
        const cleanField = detail.field.replace(/^(body|params|query)\./, '');
        fieldErrors[cleanField] = detail.message;
      }
    }
  }

  return {
    generalMessage: error.message || 'Ocurrió un error en la solicitud',
    fieldErrors,
  };
}
