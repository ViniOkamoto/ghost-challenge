import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  protected contextName?: string;

  constructor(context?: string) {
    super(context || 'Application');
    this.contextName = context;
  }

  /**
   * Custom error logging with additional context and optional stack trace
   */
  logError(message: string, stack?: string, context?: string): void {
    super.error(message, stack, context || this.contextName);

    // Here you could add additional error reporting logic:
    // - Send errors to a logging service (ELK, Loggly, etc.)
    // - Forward critical errors to alerting systems
    // - Track error frequency for monitoring

    // Example integration with an external service:
    // if (process.env.NODE_ENV === 'production') {
    //   this.sendToExternalService({
    //     level: 'error',
    //     message,
    //     context: context || this.contextName,
    //     stack,
    //     timestamp: new Date().toISOString(),
    //   });
    // }
  }

  /**
   * Log data for debugging purposes
   */
  logDebug(message: string, data?: any, context?: string): void {
    // Only log in non-production environments or when debug logging is enabled
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
      super.debug(
        `${message}${data ? ` ${JSON.stringify(data, null, 2)}` : ''}`,
        context || this.contextName,
      );
    }
  }

  /**
   * Log important business events for analytics
   */
  logEvent(
    eventName: string,
    data?: Record<string, any>,
    context?: string,
  ): void {
    super.log(
      `Event: ${eventName}${data ? ` - ${JSON.stringify(data, null, 2)}` : ''}`,
      context || this.contextName,
    );

    // Here you could send the event to analytics systems
    // Example:
    // this.sendToAnalyticsService({
    //   event: eventName,
    //   timestamp: new Date().toISOString(),
    //   ...data
    // });
  }

  /**
   * Create a scoped logger with a specific context
   */
  static createLogger(context: string): LoggerService {
    return new LoggerService(context);
  }
}
