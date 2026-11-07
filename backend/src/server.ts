import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './infrastructure/services/logger.service.js';

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`Servidor del Sistema de Investigación Criminal iniciado exitosamente`, {
    port: env.PORT,
    environment: env.NODE_ENV,
  });
});
