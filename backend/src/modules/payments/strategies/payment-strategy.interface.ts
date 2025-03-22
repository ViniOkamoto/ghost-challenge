import { Transaction } from '@prisma/client';
import { CheckoutResponseDto } from '../dto/payment-response.dto';
import { CreatePaymentDto } from '../dto/create-payment.dto';

export interface PaymentStrategy {
  processPayment(
    transaction: Transaction,
    paymentData: CreatePaymentDto,
  ): Promise<Transaction>;

  formatResponse(transaction: Transaction): CheckoutResponseDto;
}
