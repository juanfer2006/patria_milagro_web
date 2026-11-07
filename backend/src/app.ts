import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { createApiRouter } from './interface/routers/index.js';
import { errorHandler } from './interface/middlewares/error-handler.middleware.js';

export function createApp(): Express {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Montar rutas de la API bajo /api
  app.use('/api', createApiRouter());

  // Manejador centralizado de errores
  app.use(errorHandler);

  return app;
}
