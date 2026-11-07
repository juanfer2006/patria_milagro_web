import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '../../domain/services/index.js';
import { Role } from '../../domain/models/index.js';
import { env } from '../../config/env.js';

export class JwtTokenService implements ITokenService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor(secret = env.JWT_SECRET, expiresIn = env.JWT_EXPIRES_IN) {
    if (!secret) {
      throw new Error('JWT_SECRET no puede estar vacío');
    }
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  sign(payload: TokenPayload): string {
    const signOptions: jwt.SignOptions = {
      expiresIn: this.expiresIn as jwt.SignOptions['expiresIn'],
    };

    return jwt.sign(
      {
        sub: payload.sub,
        role: payload.role,
      },
      this.secret,
      signOptions,
    );
  }

  verify(token: string): TokenPayload {
    const decoded = jwt.verify(token, this.secret) as { sub: string; role: Role };
    return {
      sub: decoded.sub,
      role: decoded.role,
    };
  }
}
