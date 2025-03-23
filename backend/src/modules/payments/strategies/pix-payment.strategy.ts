import { Injectable } from '@nestjs/common';
import { Transaction, TransactionStatus } from '@prisma/client';
import { PronttusGateway } from '../gateways/pronttus.gateway';
import { PaymentStrategy } from './payment-strategy.interface';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CheckoutResponseDto } from '../dto/checkout-response.dto';

@Injectable()
export class PixPaymentStrategy implements PaymentStrategy {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly pronttusGateway: PronttusGateway,
  ) {}

  async processPayment(
    transaction: Transaction,
    paymentData: CreatePaymentDto,
  ): Promise<Transaction> {
    try {
      const { nome, cpf, email, telefone, valor } = paymentData;

      const pixPayment = await this.pronttusGateway.createPixPayment(
        nome,
        cpf,
        email,
        telefone,
        valor,
      );

      // Update transaction with payment provider info
      return await this.transactionRepository.update(transaction.id, {
        providerId: pixPayment.transactionId,
        pixCode: pixPayment.pixCode,
        pixQrCode: pixPayment.pixQrCode,
      });
    } catch {
      // If payment integration fails, mark transaction as cancelled
      await this.transactionRepository.updateStatus(
        transaction.id,
        TransactionStatus.CANCELLED,
      );
      throw new Error(`Failed to create Pix payment`);
    }
  }

  formatResponse(transaction: Transaction): CheckoutResponseDto {
    return {
      id_transacao: transaction.id,
      valor: transaction.amount / 100, // Convert cents to real value for display
      pix_qr_code: transaction.pixQrCode || undefined,
      pix_code: transaction.pixCode || undefined,
      status: transaction.status,
      prazo_pagamento: transaction.expiresAt.toISOString(),
    };
  }
}
