export interface ILogger {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
}

class AppLogger implements ILogger {
  private format(level: string, message: string, context?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const meta = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}${meta}\n`;
  }

  info(message: string, context?: Record<string, unknown>): void {
    process.stdout.write(this.format('info', message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    process.stdout.write(this.format('warn', message, context));
  }

  error(message: string, context?: Record<string, unknown>): void {
    process.stderr.write(this.format('error', message, context));
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'production') {
      process.stdout.write(this.format('debug', message, context));
    }
  }
}

export const logger = new AppLogger();
