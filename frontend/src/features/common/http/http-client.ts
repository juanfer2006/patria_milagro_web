import Cookies from 'js-cookie';
import { API_HOST, TOKEN_COOKIE_NAME } from '../config/api.config';
import { ApiError } from '../domain/api-error';

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined | null>;
}

class HttpClient {
  private getBaseUrl(): string {
    const host = API_HOST.replace(/\/+$/, '');
    return `${host}/api`;
  }

  private getToken(): string | undefined {
    return Cookies.get(TOKEN_COOKIE_NAME);
  }

  private handleUnauthorized(): void {
    if (typeof window !== 'undefined') {
      Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?expired=1';
      }
    }
  }

  private buildUrl(path: string, params?: RequestOptions['params']): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.getBaseUrl()}${cleanPath}`);

    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          url.searchParams.append(key, String(val));
        }
      });
    }

    return url.toString();
  }

  private async request<T>(
    path: string,
    method: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const headers: Record<string, string> = {
      ...options?.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let requestBody: BodyInit | undefined;
    if (body !== undefined) {
      if (body instanceof FormData) {
        requestBody = body;
        // El navegador asigna automáticamente el Content-Type multipart con boundary
      } else {
        headers['Content-Type'] = 'application/json';
        requestBody = JSON.stringify(body);
      }
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: requestBody,
      });

      if (response.status === 204) {
        return undefined as unknown as T;
      }

      if (response.status === 401) {
        this.handleUnauthorized();
      }

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        const errorPayload: ApiError = {
          status: response.status,
          code: responseData?.error?.code || 'UNKNOWN_ERROR',
          message:
            responseData?.error?.message ||
            `Error en la petición: ${response.status} ${response.statusText}`,
          details: responseData?.error?.details,
        };
        throw errorPayload;
      }

      return responseData as T;
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'status' in error && 'code' in error) {
        throw error;
      }

      const connectionError: ApiError = {
        status: 0,
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'No se pudo conectar con el servidor',
      };
      throw connectionError;
    }
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, 'GET', undefined, options);
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, 'POST', body, options);
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, 'PUT', body, options);
  }

  async delete<T = void>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, 'DELETE', undefined, options);
  }

  async upload<T>(formData: FormData, options?: RequestOptions): Promise<T> {
    return this.request<T>('/uploads', 'POST', formData, options);
  }
}

export const httpClient = new HttpClient();
