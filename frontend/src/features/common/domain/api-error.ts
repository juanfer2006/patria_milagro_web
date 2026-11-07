export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'code' in error &&
    'message' in error
  );
}
