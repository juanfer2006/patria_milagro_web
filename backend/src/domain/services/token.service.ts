import { Role } from '../models/index.js';

export interface TokenPayload {
  sub: string;
  role: Role;
}

export interface ITokenService {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
