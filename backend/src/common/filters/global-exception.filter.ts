import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppException } from '../exceptions/app-exception';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

interface ErrorResponse {
  statusCode: number;
  message: string;
  timestamp: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | Map<string, unknown> = 'Internal server error';
    let context: string | undefined = request.url;
    let metadata: Record<string, any> | undefined;

    // Extract the original error for logging
    let originalError: Error | undefined;

    // Handle different types of exceptions
    if (exception instanceof AppException) {
      // Our custom exception
      statusCode = exception.getStatus();
      message = exception.message;
      context = exception.context;
      metadata = exception.metadata;
      originalError = exception.getOriginalError();
    } else if (exception instanceof HttpException) {
      // NestJS HTTP exceptions
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse() as string;
      message = exceptionResponse || 'Internal server error';
    } else if (exception instanceof PrismaClientKnownRequestError) {
      // Handle Prisma errors
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Database operation failed';
      originalError = exception;
    } else if (exception instanceof Error) {
      // Generic Error object
      message = exception.message;
      originalError = exception;
    }

    // Create error response object
    const errorResponse: ErrorResponse = {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    };

    // Log the error with context information
    this.logError(exception, {
      context,
      originalError,
      request: {
        url: request.url,
        method: request.method,
        headers: request.headers,
        body: request.body as Record<string, any>,
        query: request.query,
        params: request.params,
      },
      statusCode,
      metadata,
    });

    // Send response
    response.status(statusCode).json(errorResponse);
  }

  private logError(exception: unknown, context: Record<string, any>): void {
    // Format the error message
    const errorMessage =
      exception instanceof Error ? exception.message : String(exception);

    // Get stack trace if available
    const stack = exception instanceof Error ? exception.stack : undefined;

    this.logger.error(
      `Exception occurred: ${errorMessage}`,
      stack,
      context.request && typeof context.request === 'object'
        ? (context.request as Record<string, any>).url
        : 'unknown-url',
    );

    // Log detailed info only in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(JSON.stringify(context, null, 2));
    }

    // Here you could add integration with monitoring services
    // For example: Sentry, DataDog, New Relic, etc.
    // if (process.env.SENTRY_DSN) {
    //   Sentry.captureException(exception, { extra: context });
    // }
  }
}
