import { Transaction } from '@prisma/client';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { CheckoutResponseDto } from '../dto/checkout-response.dto';

export interface PaymentStrategy {
  processPayment(
    transaction: Transaction,
    paymentData: CreatePaymentDto,
  ): Promise<Transaction>;

  formatResponse(transaction: Transaction): CheckoutResponseDto;
}
