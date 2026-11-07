export interface ErrorDetail {
  field?: string;
  message: string;
}

export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly code: string;
  public readonly details?: ErrorDetail[];

  constructor(message: string, details?: ErrorDetail[]) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  public readonly statusCode = 400;
  public readonly code = 'VALIDATION_ERROR';

  constructor(message = 'Los datos proporcionados no son válidos', details?: ErrorDetail[]) {
    super(message, details);
  }
}

export class UnauthorizedError extends AppError {
  public readonly statusCode = 401;
  public readonly code = 'UNAUTHORIZED';

  constructor(message = 'No autorizado para acceder a este recurso') {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  public readonly statusCode = 403;
  public readonly code = 'FORBIDDEN';

  constructor(message = 'No tiene permisos suficientes para realizar esta acción') {
    super(message);
  }
}

export class NotFoundError extends AppError {
  public readonly statusCode = 404;
  public readonly code = 'NOT_FOUND';

  constructor(message = 'El recurso solicitado no fue encontrado') {
    super(message);
  }
}

export class ConflictError extends AppError {
  public readonly statusCode = 409;
  public readonly code = 'CONFLICT';

  constructor(message = 'Existe un conflicto con el estado actual del recurso') {
    super(message);
  }
}

export class PayloadTooLargeError extends AppError {
  public readonly statusCode = 413;
  public readonly code = 'PAYLOAD_TOO_LARGE';

  constructor(message = 'El tamaño del archivo o la carga útil excede el límite permitido') {
    super(message);
  }
}
