/**
 * DROMIC-IS Logging Utility
 * 
 * Centralized logging system for the DROMIC-IS application.
 * Provides different log levels and environment-specific behavior.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  environment: string;
  component?: string;
  userId?: string;
  sessionId?: string;
  traceId?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableExternalLogging: boolean;
  component?: string;
}

class Logger {
  private config: LoggerConfig;
  private logLevels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: (process.env.LOG_LEVEL as LogLevel) || 'info',
      enableConsole: true,
      enableExternalLogging: process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENV === 'staging',
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return this.logLevels[level] >= this.logLevels[this.config.level];
  }

  private formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, component, message, data } = entry;
    const componentStr = component ? `[${component}] ` : '';
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    
    return `${timestamp} [${level.toUpperCase()}] ${componentStr}${message}${dataStr}`;
  }

  private async sendToExternalLogging(entry: LogEntry): Promise<void> {
    // TODO: Implement external logging service integration
    // Examples: DataDog, LogRocket, Sentry, CloudWatch, etc.
    
    if (process.env.NEXT_PUBLIC_ENV === 'staging') {
      // In staging, you might want to send to a staging log aggregator
      console.log('📊 [EXTERNAL LOG]', JSON.stringify(entry, null, 2));
    }
    
    // Example implementation for different services:
    /*
    switch (process.env.LOG_SERVICE) {
      case 'datadog':
        await this.sendToDatadog(entry);
        break;
      case 'cloudwatch':
        await this.sendToCloudWatch(entry);
        break;
      case 'sentry':
        if (entry.level === 'error') {
          await this.sendToSentry(entry);
        }
        break;
    }
    */
  }

  private async log(level: LogLevel, message: string, data?: any, options?: { component?: string; userId?: string }): Promise<void> {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      component: options?.component || this.config.component,
      userId: options?.userId,
      // Generate a simple trace ID for request tracking
      traceId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    // Console logging
    if (this.config.enableConsole) {
      const formattedMessage = this.formatLogEntry(entry);
      
      switch (level) {
        case 'debug':
          console.debug(formattedMessage);
          break;
        case 'info':
          console.info(formattedMessage);
          break;
        case 'warn':
          console.warn(formattedMessage);
          break;
        case 'error':
          console.error(formattedMessage);
          break;
      }
    }

    // External logging
    if (this.config.enableExternalLogging) {
      try {
        await this.sendToExternalLogging(entry);
      } catch (error) {
        // Don't let logging errors break the application
        console.error('Failed to send log to external service:', error);
      }
    }
  }

  // Public logging methods
  async debug(message: string, data?: any, options?: { component?: string; userId?: string }): Promise<void> {
    return this.log('debug', message, data, options);
  }

  async info(message: string, data?: any, options?: { component?: string; userId?: string }): Promise<void> {
    return this.log('info', message, data, options);
  }

  async warn(message: string, data?: any, options?: { component?: string; userId?: string }): Promise<void> {
    return this.log('warn', message, data, options);
  }

  async error(message: string, data?: any, options?: { component?: string; userId?: string }): Promise<void> {
    return this.log('error', message, data, options);
  }

  // Specialized logging methods for DROMIC-IS
  async auditLog(action: string, userId: string, data?: any): Promise<void> {
    return this.info(`AUDIT: ${action}`, data, { component: 'AUDIT', userId });
  }

  async securityLog(event: string, details?: any): Promise<void> {
    return this.warn(`SECURITY: ${event}`, details, { component: 'SECURITY' });
  }

  async performanceLog(operation: string, duration: number, data?: any): Promise<void> {
    return this.info(`PERFORMANCE: ${operation} completed in ${duration}ms`, data, { component: 'PERFORMANCE' });
  }

  async incidentLog(level: 'info' | 'warn' | 'error', incident: string, data?: any): Promise<void> {
    return this.log(level, `INCIDENT: ${incident}`, data, { component: 'INCIDENT_MANAGEMENT' });
  }

  // Create a child logger with specific component context
  createChild(component: string): Logger {
    return new Logger({
      ...this.config,
      component,
    });
  }
}

// Create default logger instance
export const logger = new Logger();

// Create specialized loggers for different components
export const apiLogger = logger.createChild('API');
export const authLogger = logger.createChild('AUTH');
export const dbLogger = logger.createChild('DATABASE');
export const incidentLogger = logger.createChild('INCIDENT');
export const reportLogger = logger.createChild('REPORTS');

// Export the Logger class for custom instances
export { Logger };

// Utility function for measuring performance
export function withPerformanceLogging<T>(
  operation: string,
  fn: () => Promise<T> | T,
  logger: Logger = apiLogger
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const startTime = Date.now();
    
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      await logger.performanceLog(operation, duration);
      resolve(result);
    } catch (error) {
      const duration = Date.now() - startTime;
      await logger.error(`${operation} failed after ${duration}ms`, { error: error instanceof Error ? error.message : error });
      reject(error);
    }
  });
}
