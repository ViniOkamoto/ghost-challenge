import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/db/prisma.service';
import { PaymentMethod, Transaction, TransactionStatus } from '@prisma/client';
import {
  InvalidTransactionIdException,
  TransactionNotFoundException,
} from '../errors/payment-errors';

@Injectable()
export class TransactionRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    email: string;
    phone: string;
    document: string;
    amount: number;
    paymentMethod: PaymentMethod;
    expiresAt: Date;
    pixCode?: string;
    pixQrCode?: string;
    installments?: number;
  }): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        document: data.document,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        status: TransactionStatus.PENDING,
        expiresAt: data.expiresAt,
        pixCode: data.pixCode,
        pixQrCode: data.pixQrCode,
        installments: data.installments,
      },
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id },
      });

      return transaction;
    } catch (error: unknown) {
      // Handle invalid UUID errors from Prisma
      if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as { code: string };
        if (prismaError.code === 'P2023') {
          throw new InvalidTransactionIdException(
            id,
            error instanceof Error ? error : new Error(JSON.stringify(error)),
          );
        }
      }
      throw error;
    }
  }

  async update(id: string, data: Partial<Transaction>): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    amountPaid?: number,
  ): Promise<Transaction> {
    const updateData: { status: TransactionStatus; amountPaid?: number } = {
      status,
    };

    if (amountPaid !== undefined) {
      updateData.amountPaid = amountPaid;
    }

    return this.prisma.transaction.update({
      where: { id },
      data: updateData,
    });
  }

  async findByIdOrThrow(id: string): Promise<Transaction> {
    const transaction = await this.findById(id);

    if (!transaction) {
      throw new TransactionNotFoundException(id);
    }

    return transaction;
  }
}
