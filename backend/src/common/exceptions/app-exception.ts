import { HttpException, HttpStatus } from '@nestjs/common';

export interface AppExceptionOptions {
  status?: HttpStatus;
  message?: string;
  error?: Error;
  context?: string;
  code?: string;
  metadata?: Record<string, any>;
}

export class AppException extends HttpException {
  public readonly timestamp: Date;
  public readonly context?: string;
  public readonly code?: string;
  public readonly metadata?: Record<string, any>;
  public readonly originalError?: Error;

  constructor(options: AppExceptionOptions = {}) {
    const {
      status = HttpStatus.INTERNAL_SERVER_ERROR,
      message = 'Internal server error',
      error,
      context,
      code,
      metadata,
    } = options;

    super(
      {
        message,
        statusCode: status,
        error: HttpStatus[status] || 'Internal Server Error',
        ...(code && { code }),
        ...(context && { context }),
        ...(metadata && { metadata }),
      },
      status,
    );

    this.timestamp = new Date();
    this.context = context;
    this.code = code;
    this.metadata = metadata;
    this.originalError = error;

    // Preserve the original stack trace if an error was passed
    if (error instanceof Error) {
      this.stack = error.stack;
    }
  }

  getOriginalError(): Error | undefined {
    return this.originalError;
  }
}

// Specific exception classes for common use cases
export class BadRequestException extends AppException {
  constructor(options: Omit<AppExceptionOptions, 'status'> = {}) {
    super({ ...options, status: HttpStatus.BAD_REQUEST });
  }
}

export class UnauthorizedException extends AppException {
  constructor(options: Omit<AppExceptionOptions, 'status'> = {}) {
    super({ ...options, status: HttpStatus.UNAUTHORIZED });
  }
}

export class ForbiddenException extends AppException {
  constructor(options: Omit<AppExceptionOptions, 'status'> = {}) {
    super({ ...options, status: HttpStatus.FORBIDDEN });
  }
}

export class NotFoundException extends AppException {
  constructor(options: Omit<AppExceptionOptions, 'status'> = {}) {
    super({ ...options, status: HttpStatus.NOT_FOUND });
  }
}

export class ConflictException extends AppException {
  constructor(options: Omit<AppExceptionOptions, 'status'> = {}) {
    super({ ...options, status: HttpStatus.CONFLICT });
  }
}

export class InternalServerErrorException extends AppException {
  constructor(options: Omit<AppExceptionOptions, 'status'> = {}) {
    super({ ...options, status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
