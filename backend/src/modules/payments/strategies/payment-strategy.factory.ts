import { Injectable } from '@nestjs/common';
import { PaymentMethod } from '@prisma/client';
import { PaymentStrategy } from './payment-strategy.interface';
import { PixPaymentStrategy } from './pix-payment.strategy';
import { CreditCardPaymentStrategy } from './credit-card-payment.strategy';
import { InvalidPaymentMethodException } from '../errors/payment-errors';

@Injectable()
export class PaymentStrategyFactory {
  constructor(
    private readonly pixPaymentStrategy: PixPaymentStrategy,
    private readonly creditCardPaymentStrategy: CreditCardPaymentStrategy,
  ) {}

  getStrategy(paymentMethod: PaymentMethod): PaymentStrategy {
    switch (paymentMethod) {
      case PaymentMethod.PIX:
        return this.pixPaymentStrategy;
      case PaymentMethod.CREDIT_CARD:
        return this.creditCardPaymentStrategy;
      default:
        throw new InvalidPaymentMethodException(String(paymentMethod));
    }
  }
}
