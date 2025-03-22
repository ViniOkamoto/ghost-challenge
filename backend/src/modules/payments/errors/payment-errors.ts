import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  AppExceptionOptions,
} from '../../../common/exceptions/app-exception';

/**
 * Error codes specific to the Payments module
 */
export enum PaymentErrorCodes {
  // Not Found errors
  TRANSACTION_NOT_FOUND = 'PAYMENT.NOT_FOUND.TRANSACTION',
  INVALID_TRANSACTION_ID = 'PAYMENT.NOT_FOUND.INVALID_ID',

  // Bad Request errors
  INVALID_TRANSACTION_STATUS = 'PAYMENT.BAD_REQUEST.INVALID_STATUS',
  INVALID_PAYMENT_METHOD = 'PAYMENT.BAD_REQUEST.INVALID_METHOD',
  TRANSACTION_EXPIRED = 'PAYMENT.BAD_REQUEST.EXPIRED',

  // Server errors
  PAYMENT_PROCESSING_FAILED = 'PAYMENT.ERROR.PROCESSING_FAILED',
  PAYMENT_APPROVAL_FAILED = 'PAYMENT.ERROR.APPROVAL_FAILED',
  PAYMENT_STATUS_FAILED = 'PAYMENT.ERROR.STATUS_FAILED',
  PROVIDER_ERROR = 'PAYMENT.ERROR.PROVIDER',
}

/**
 * Transaction not found exception
 */
export class TransactionNotFoundException extends NotFoundException {
  constructor(transactionId: string, options?: Partial<AppExceptionOptions>) {
    super({
      message: `Transaction with ID ${transactionId} not found`,
      context: 'PaymentsService',
      code: PaymentErrorCodes.TRANSACTION_NOT_FOUND,
      metadata: { transactionId },
      ...options,
    });
  }
}

/**
 * Invalid transaction ID format exception
 */
export class InvalidTransactionIdException extends NotFoundException {
  constructor(
    transactionId: string,
    error?: Error,
    options?: Partial<AppExceptionOptions>,
  ) {
    super({
      message: `Transaction with ID ${transactionId} not found or invalid format`,
      context: 'PaymentsService',
      code: PaymentErrorCodes.INVALID_TRANSACTION_ID,
      error,
      metadata: { transactionId },
      ...options,
    });
  }
}

/**
 * Invalid transaction status exception
 */
export class InvalidTransactionStatusException extends BadRequestException {
  constructor(
    transactionId: string,
    currentStatus: string,
    options?: Partial<AppExceptionOptions>,
  ) {
    super({
      message: `Transaction with ID ${transactionId} has invalid status: ${currentStatus}`,
      context: 'PaymentsService',
      code: PaymentErrorCodes.INVALID_TRANSACTION_STATUS,
      metadata: {
        transactionId,
        currentStatus,
      },
      ...options,
    });
  }
}

/**
 * Payment processing failed exception
 */
export class PaymentProcessingFailedException extends InternalServerErrorException {
  constructor(
    transactionId: string,
    paymentMethod: string,
    error?: Error,
    options?: Partial<AppExceptionOptions>,
  ) {
    super({
      message: 'Payment processing failed',
      context: 'PaymentsService.createPayment',
      code: PaymentErrorCodes.PAYMENT_PROCESSING_FAILED,
      error,
      metadata: {
        transactionId,
        method: paymentMethod,
      },
      ...options,
    });
  }
}

/**
 * Payment approval failed exception
 */
export class PaymentApprovalFailedException extends InternalServerErrorException {
  constructor(
    transactionId: string,
    error?: Error,
    options?: Partial<AppExceptionOptions>,
  ) {
    super({
      message: 'Failed to approve payment',
      context: 'PaymentsService.approvePayment',
      code: PaymentErrorCodes.PAYMENT_APPROVAL_FAILED,
      error,
      metadata: { transactionId },
      ...options,
    });
  }
}

/**
 * Payment status retrieval failed exception
 */
export class PaymentStatusFailedException extends InternalServerErrorException {
  constructor(
    transactionId: string,
    error?: Error,
    options?: Partial<AppExceptionOptions>,
  ) {
    super({
      message: 'Failed to get payment status',
      context: 'PaymentsService.getPaymentStatus',
      code: PaymentErrorCodes.PAYMENT_STATUS_FAILED,
      error,
      metadata: { transactionId },
      ...options,
    });
  }
}

/**
 * Invalid payment method exception
 */
export class InvalidPaymentMethodException extends BadRequestException {
  constructor(paymentMethod: string, options?: Partial<AppExceptionOptions>) {
    super({
      message: `Payment method ${paymentMethod} not supported`,
      context: 'PaymentStrategyFactory.getStrategy',
      code: PaymentErrorCodes.INVALID_PAYMENT_METHOD,
      metadata: { paymentMethod },
      ...options,
    });
  }
}
