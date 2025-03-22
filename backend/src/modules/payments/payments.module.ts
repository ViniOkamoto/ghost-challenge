import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PronttusGateway } from './gateways/pronttus.gateway';
import { PixPaymentStrategy } from './strategies/pix-payment.strategy';
import { CreditCardPaymentStrategy } from './strategies/credit-card-payment.strategy';
import { PaymentStrategyFactory } from './strategies/payment-strategy.factory';
import { TransactionRepository } from './repositories/transaction.repository';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    TransactionRepository,
    PronttusGateway,
    PixPaymentStrategy,
    CreditCardPaymentStrategy,
    PaymentStrategyFactory,
  ],
})
export class PaymentsModule {}
