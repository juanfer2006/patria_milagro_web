import { Actor } from '../../domain/models/index.js';

declare global {
  namespace Express {
    interface Request {
      user?: Actor;
    }
    interface Locals {
      validated?: {
        body?: unknown;
        params?: unknown;
        query?: unknown;
      };
    }
  }
}

export {};
