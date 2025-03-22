import { Injectable, Logger } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';
import { Transaction } from '@prisma/client';
import { CheckoutResponseDto } from '../dto/payment-response.dto';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { TransactionRepository } from '../repositories/transaction.repository';

@Injectable()
export class CreditCardPaymentStrategy implements PaymentStrategy {
  private readonly logger = new Logger(CreditCardPaymentStrategy.name);

  constructor(private readonly transactionRepository: TransactionRepository) {}

  async processPayment(
    transaction: Transaction,
    paymentData: CreatePaymentDto,
  ): Promise<Transaction> {
    // For now, just return the transaction as it is
    // In a real implementation, this would integrate with a credit card payment gateway
    this.logger.log(
      `Processing credit card payment for transaction ${transaction.id}`,
    );

    // Simulação: em um caso real, integraria com um gateway de cartão de crédito
    // Do a dummy update to use await
    return await this.transactionRepository.update(transaction.id, {
      // No actual changes for simulator
      installments: paymentData.parcelas || 1,
    });
  }

  formatResponse(transaction: Transaction): CheckoutResponseDto {
    return {
      id_transacao: transaction.id,
      valor: transaction.amount / 100, // Convert cents to real value for display
      status: transaction.status,
      prazo_pagamento: transaction.expiresAt.toISOString(),
    };
  }
}
