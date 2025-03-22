import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';
import { Request, Response } from 'express';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new LoggerService(RequestLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const processedTime = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const controller = context.getClass().name;
    const handler = context.getHandler().name;

    // Extract relevant parts for logging based on the path

    let logData: Record<string, any> = {};

    const logContext = `${controller}.${handler}`;
    logData = { method, url };

    // Log the attempt
    this.logger.logEvent(logContext, {
      ...logData,
      timestamp: new Date().toISOString(),
    });

    // Process the request and log the result
    return next.handle().pipe(
      tap({
        next: () => {
          // Convert attempt to success for the completion log
          const successContext = logContext.replace('.attempt', '.success');

          // Log successful completion
          this.logger.logEvent(successContext, {
            ...logData,
            responseTime: `${Date.now() - processedTime}ms`,
            statusCode: context.switchToHttp().getResponse<Response>()
              .statusCode,
          });
        },
        // Error handling will be done by the exception filter
      }),
    );
  }
}
