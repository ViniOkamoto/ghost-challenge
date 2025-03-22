import { Test, TestingModule } from '@nestjs/testing';
import { PaymentStrategyFactory } from '../src/modules/payments/strategies/payment-strategy.factory';
import { PixPaymentStrategy } from '../src/modules/payments/strategies/pix-payment.strategy';
import { CreditCardPaymentStrategy } from '../src/modules/payments/strategies/credit-card-payment.strategy';
import { PaymentMethod } from '@prisma/client';

describe('PaymentStrategyFactory', () => {
  let factory: PaymentStrategyFactory;
  let pixStrategy: PixPaymentStrategy;
  let creditCardStrategy: CreditCardPaymentStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentStrategyFactory,
        {
          provide: PixPaymentStrategy,
          useValue: { processPayment: jest.fn(), formatResponse: jest.fn() },
        },
        {
          provide: CreditCardPaymentStrategy,
          useValue: { processPayment: jest.fn(), formatResponse: jest.fn() },
        },
      ],
    }).compile();

    factory = module.get<PaymentStrategyFactory>(PaymentStrategyFactory);
    pixStrategy = module.get<PixPaymentStrategy>(PixPaymentStrategy);
    creditCardStrategy = module.get<CreditCardPaymentStrategy>(
      CreditCardPaymentStrategy,
    );
  });

  it('should be defined', () => {
    expect(factory).toBeDefined();
  });

  describe('getStrategy', () => {
    it('should return PixPaymentStrategy for PIX payment method', () => {
      // Act
      const result = factory.getStrategy(PaymentMethod.PIX);

      // Assert
      expect(result).toBe(pixStrategy);
    });

    it('should return CreditCardPaymentStrategy for CREDIT_CARD payment method', () => {
      // Act
      const result = factory.getStrategy(PaymentMethod.CREDIT_CARD);

      // Assert
      expect(result).toBe(creditCardStrategy);
    });

    it('should throw an error for unsupported payment methods', () => {
      // Act & Assert
      expect(() => {
        factory.getStrategy('INVALID_METHOD' as PaymentMethod);
      }).toThrow('Payment method INVALID_METHOD not supported');
    });
  });
});
