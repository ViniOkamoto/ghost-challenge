import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../src/modules/payments/payments.service';
import { PaymentStrategyFactory } from '../src/modules/payments/strategies/payment-strategy.factory';
import { CreatePaymentDto } from '../src/modules/payments/dto/create-payment.dto';
import { PaymentMethod, TransactionStatus } from '@prisma/client';
import { ApprovePaymentDto } from '../src/modules/payments/dto/approve-payment.dto';
import { TransactionRepository } from '../src/modules/payments/repositories/transaction.repository';
import { TransactionNotFoundException } from '../src/modules/payments/errors/payment-errors';

describe('PaymentsService', () => {
  let service: PaymentsService;

  const mockTransactionRepository = {
    create: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
    findByIdOrThrow: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockPixStrategy = {
    processPayment: jest.fn(),
    formatResponse: jest.fn(),
  };

  const mockStrategyFactory = {
    getStrategy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: TransactionRepository, useValue: mockTransactionRepository },
        { provide: PaymentStrategyFactory, useValue: mockStrategyFactory },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPayment', () => {
    it('should create a payment and process it with the correct strategy', async () => {
      // Arrange
      const createPaymentDto: CreatePaymentDto = {
        nome: 'Test User',
        email: 'test@example.com',
        telefone: '1234567890',
        cpf: '12345678901',
        valor: 10000,
        metodo_pagamento: 'pix',
        parcelas: 1,
      };

      const mockTransaction = {
        id: 'mock-id',
        name: createPaymentDto.nome,
        email: createPaymentDto.email,
        phone: createPaymentDto.telefone,
        document: createPaymentDto.cpf,
        amount: createPaymentDto.valor,
        paymentMethod: PaymentMethod.PIX,
        status: TransactionStatus.PENDING,
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        installments: 1,
        amountPaid: null,
        providerId: null,
        pixCode: null,
        pixQrCode: null,
      };

      const mockResponse = {
        id_transacao: 'mock-id',
        valor: 100,
        status: 'PENDING',
        prazo_pagamento: mockTransaction.expiresAt.toISOString(),
      };

      mockTransactionRepository.create.mockResolvedValue(mockTransaction);
      mockStrategyFactory.getStrategy.mockReturnValue(mockPixStrategy);
      mockPixStrategy.processPayment.mockResolvedValue(mockTransaction);
      mockPixStrategy.formatResponse.mockReturnValue(mockResponse);

      // Act
      const result = await service.createPayment(createPaymentDto);

      // Assert
      expect(mockTransactionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createPaymentDto.nome,
          email: createPaymentDto.email,
          amount: createPaymentDto.valor,
          paymentMethod: PaymentMethod.PIX,
          installments: createPaymentDto.parcelas,
        }),
      );
      expect(mockStrategyFactory.getStrategy).toHaveBeenCalledWith(
        PaymentMethod.PIX,
      );
      expect(mockPixStrategy.processPayment).toHaveBeenCalledWith(
        mockTransaction,
        createPaymentDto,
      );
      expect(mockPixStrategy.formatResponse).toHaveBeenCalledWith(
        mockTransaction,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('approvePayment', () => {
    it('should approve a pending payment', async () => {
      // Arrange
      const approveDto: ApprovePaymentDto = {
        id_transacao: 'mock-id',
      };

      const mockTransaction = {
        id: 'mock-id',
        status: TransactionStatus.PENDING,
        amount: 10000,
      };

      mockTransactionRepository.findByIdOrThrow.mockResolvedValue(
        mockTransaction,
      );
      mockTransactionRepository.updateStatus.mockResolvedValue({
        ...mockTransaction,
        status: TransactionStatus.APPROVED,
      });

      // Act
      await service.approvePayment(approveDto);

      // Assert
      expect(mockTransactionRepository.findByIdOrThrow).toHaveBeenCalledWith(
        approveDto.id_transacao,
      );
      expect(mockTransactionRepository.updateStatus).toHaveBeenCalledWith(
        approveDto.id_transacao,
        TransactionStatus.APPROVED,
        mockTransaction.amount,
      );
    });

    it('should throw TransactionNotFoundException when transaction not found', async () => {
      // Arrange
      const approveDto: ApprovePaymentDto = {
        id_transacao: 'non-existent-id',
      };

      mockTransactionRepository.findByIdOrThrow.mockRejectedValue(
        new TransactionNotFoundException(approveDto.id_transacao),
      );

      // Act & Assert
      await expect(service.approvePayment(approveDto)).rejects.toThrow(
        TransactionNotFoundException,
      );
    });
  });

  describe('getPaymentStatus', () => {
    it('should return payment status when transaction exists', async () => {
      // Arrange
      const transactionId = 'mock-id';
      const mockTransaction = {
        id: transactionId,
        status: TransactionStatus.PENDING,
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        document: '12345678901',
        amount: 10000,
        amountPaid: null,
        paymentMethod: PaymentMethod.PIX,
        installments: 1,
      };

      mockTransactionRepository.findByIdOrThrow.mockResolvedValue(
        mockTransaction,
      );

      // Act
      const result = await service.getPaymentStatus(transactionId);

      // Assert
      expect(mockTransactionRepository.findByIdOrThrow).toHaveBeenCalledWith(
        transactionId,
      );
      expect(result).toEqual({
        status: mockTransaction.status,
        nome: mockTransaction.name,
        email: mockTransaction.email,
        telefone: mockTransaction.phone,
        cpf: mockTransaction.document,
        valor_total: mockTransaction.amount,
        valor_pago: 0,
        metodo_pagamento: 'pix',
        parcelas: mockTransaction.installments,
        id_transacao: mockTransaction.id,
      });
    });

    it('should throw TransactionNotFoundException when transaction not found', async () => {
      // Arrange
      const transactionId = 'non-existent-id';

      mockTransactionRepository.findByIdOrThrow.mockRejectedValue(
        new TransactionNotFoundException(transactionId),
      );

      // Act & Assert
      await expect(service.getPaymentStatus(transactionId)).rejects.toThrow(
        TransactionNotFoundException,
      );
    });
  });
});
