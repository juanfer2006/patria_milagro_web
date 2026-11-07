import { httpClient } from '../../common/http/http-client';
import { AuthResponse, User } from '../domain/user';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>('/auth/register', payload);
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>('/auth/login', payload);
  },

  async getCurrentUser(): Promise<User> {
    const response = await httpClient.get<{ user?: User; data?: User }>('/auth/me');
    const user = response.user || response.data;
    if (!user) {
      throw new Error('No se pudo recuperar la información del usuario');
    }
    return user;
  },
};
