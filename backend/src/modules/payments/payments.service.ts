import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  CheckoutResponseDto,
  PaymentStatusDto,
} from './dto/payment-response.dto';
import { PaymentMethod, TransactionStatus } from '@prisma/client';
import { ApprovePaymentDto } from './dto/approve-payment.dto';
import { PaymentStrategyFactory } from './strategies/payment-strategy.factory';
import {
  TransactionNotFoundException,
  InvalidTransactionIdException,
  InvalidTransactionStatusException,
  PaymentProcessingFailedException,
  PaymentApprovalFailedException,
  PaymentStatusFailedException,
} from './errors/payment-errors';
import { TransactionRepository } from './repositories/transaction.repository';

@Injectable()
export class PaymentsService {
  constructor(
    private transactionRepository: TransactionRepository,
    private paymentStrategyFactory: PaymentStrategyFactory,
  ) {}

  async createPayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<CheckoutResponseDto> {
    const { nome, email, telefone, cpf, valor, metodo_pagamento, parcelas } =
      createPaymentDto;

    // Set payment expiration to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Convert payment method to enum
    const paymentMethod: PaymentMethod =
      metodo_pagamento === 'pix'
        ? PaymentMethod.PIX
        : PaymentMethod.CREDIT_CARD;

    // Initialize transaction object
    let transaction = await this.transactionRepository.create({
      name: nome,
      email,
      phone: telefone,
      document: cpf,
      amount: valor,
      paymentMethod,
      expiresAt,
      installments: parcelas,
    });

    // Get the appropriate payment strategy
    const paymentStrategy =
      this.paymentStrategyFactory.getStrategy(paymentMethod);

    // Process the payment using the strategy
    try {
      transaction = await paymentStrategy.processPayment(
        transaction,
        createPaymentDto,
      );
    } catch (error: unknown) {
      throw new PaymentProcessingFailedException(
        transaction.id,
        paymentMethod,
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }

    // Format the response using the strategy
    return paymentStrategy.formatResponse(transaction);
  }

  async approvePayment(approvePaymentDto: ApprovePaymentDto): Promise<void> {
    const { id_transacao } = approvePaymentDto;

    try {
      const transaction =
        await this.transactionRepository.findByIdOrThrow(id_transacao);

      if (transaction.status !== TransactionStatus.PENDING) {
        throw new InvalidTransactionStatusException(
          id_transacao,
          transaction.status,
        );
      }

      await this.transactionRepository.updateStatus(
        id_transacao,
        TransactionStatus.APPROVED,
        transaction.amount,
      );
    } catch (error: unknown) {
      // If it's already one of our domain exceptions, just rethrow it
      if (
        error instanceof TransactionNotFoundException ||
        error instanceof InvalidTransactionStatusException
      ) {
        throw error;
      }
      // Rethrow as payment approval failed exception
      throw new PaymentApprovalFailedException(
        id_transacao,
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getPaymentStatus(id: string): Promise<PaymentStatusDto> {
    try {
      const transaction = await this.transactionRepository.findByIdOrThrow(id);

      return {
        status: transaction.status,
        nome: transaction.name,
        email: transaction.email,
        telefone: transaction.phone,
        cpf: transaction.document,
        valor_total: transaction.amount,
        valor_pago: transaction.amountPaid || 0,
        metodo_pagamento: transaction.paymentMethod.toLowerCase(),
        parcelas: transaction.installments,
        id_transacao: transaction.id,
      };
    } catch (error: unknown) {
      // If it's already our domain exception, just rethrow it
      if (error instanceof TransactionNotFoundException) {
        throw error;
      }

      // For database errors with invalid UUIDs
      if (error instanceof InvalidTransactionIdException) {
        throw error;
      }

      // Rethrow as payment status failed exception
      throw new PaymentStatusFailedException(
        id,
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
