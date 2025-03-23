import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/core/db/prisma.service';
import { CreatePaymentDto } from '../src/modules/payments/dto/create-payment.dto';
import { TransactionStatus } from '@prisma/client';
import { PronttusGateway } from '../src/modules/payments/gateways/pronttus.gateway';
import { TransactionRepository } from '../src/modules/payments/repositories/transaction.repository';

interface ResponseWithTransaction {
  id_transacao: string;
  valor: number;
  pix_qr_code?: string;
  pix_code?: string;
  status: string;
  prazo_pagamento: string;
}

describe('Payments Flow (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let transactionRepository: TransactionRepository;

  // Mock the Pronttus gateway to avoid real API calls
  const mockPronttusGateway = {
    createPixPayment: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        transactionId: 'mock-provider-id',
        pixCode: 'mock-pix-code',
        pixQrCode: 'mock-qr-code-data',
        status: 'WAITING_PAYMENT',
        generatedAt: new Date().toISOString(),
      });
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PronttusGateway)
      .useValue(mockPronttusGateway)
      .compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get<PrismaService>(PrismaService);
    transactionRepository = app.get<TransactionRepository>(
      TransactionRepository,
    );

    // Configure validation pipe
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();

    // Clear database before tests
    await prismaService.transaction.deleteMany({});
  });

  afterAll(async () => {
    // Clear database after tests
    await prismaService.transaction.deleteMany({});
    await app.close();
  });

  describe('/checkout (POST)', () => {
    it('should create a new payment transaction', async () => {
      const createPaymentDto: CreatePaymentDto = {
        nome: 'Test User',
        email: 'test@example.com',
        telefone: '11987654321',
        cpf: '52998224725',
        valor: 10000,
        metodo_pagamento: 'pix',
      };

      const response = await request(app.getHttpServer())
        .post('/checkout')
        .send(createPaymentDto)
        .expect(201);

      const responseBody = response.body as ResponseWithTransaction;
      expect(responseBody).toHaveProperty('id_transacao');
      expect(responseBody).toHaveProperty('valor', 10000 / 100);
      expect(responseBody).toHaveProperty('pix_qr_code', 'mock-qr-code-data');
      expect(responseBody).toHaveProperty('pix_code', 'mock-pix-code');
      expect(responseBody).toHaveProperty('status', TransactionStatus.PENDING);
      expect(responseBody).toHaveProperty('prazo_pagamento');

      // Store the transaction ID for the next tests
      const transactionId = responseBody.id_transacao;
      return transactionId;
    });
  });

  describe('/payment/approve (POST)', () => {
    it('should approve a payment transaction', async () => {
      // First create a transaction
      const createPaymentDto: CreatePaymentDto = {
        nome: 'Test User',
        email: 'test@example.com',
        telefone: '11987654321',
        cpf: '52998224725',
        valor: 10000,
        metodo_pagamento: 'pix',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/checkout')
        .send(createPaymentDto);

      const responseBody = createResponse.body as ResponseWithTransaction;
      const transactionId = responseBody.id_transacao;

      // Then approve it
      const approveResponse = await request(app.getHttpServer())
        .post('/payment/approve')
        .send({ id_transacao: transactionId })
        .expect(200);

      expect(approveResponse.body).toHaveProperty(
        'message',
        'Payment approved successfully',
      );

      // Check that the transaction is approved
      const transaction = await transactionRepository.findById(transactionId);

      expect(transaction).toHaveProperty('status', TransactionStatus.APPROVED);
      expect(transaction).toHaveProperty('amountPaid', 10000);
    });

    it('should return 400 for invalid input format', async () => {
      await request(app.getHttpServer())
        .post('/payment/approve')
        .send({ id_transacao: 'invalid-uuid-format' })
        .expect(400);
    });
  });

  describe('/payment/:order_id (GET)', () => {
    it('should return payment status', async () => {
      // First create a transaction
      const createPaymentDto: CreatePaymentDto = {
        nome: 'Test User',
        email: 'test@example.com',
        telefone: '11987654321',
        cpf: '52998224725',
        valor: 10000,
        metodo_pagamento: 'pix',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/checkout')
        .send(createPaymentDto);

      const responseBody = createResponse.body as ResponseWithTransaction;
      const transactionId = responseBody.id_transacao;

      // Get the status
      const statusResponse = await request(app.getHttpServer())
        .get(`/payment/${transactionId}`)
        .expect(200);

      expect(statusResponse.body).toHaveProperty(
        'status',
        TransactionStatus.PENDING,
      );
      expect(statusResponse.body).toHaveProperty('nome', 'Test User');
      expect(statusResponse.body).toHaveProperty('email', 'test@example.com');
      expect(statusResponse.body).toHaveProperty('valor_total', 10000 / 100);
      expect(statusResponse.body).toHaveProperty('metodo_pagamento', 'pix');
    });

    it('should return 404 for non-existent transaction', async () => {
      await request(app.getHttpServer())
        .get('/payment/non-existent-id')
        .expect(404);
    });
  });
});
