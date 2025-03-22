import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface PronttusCustomer {
  name: string;
  document: string;
  email: string;
  phone: string;
}

interface PronttusPaymentRequest {
  customer: PronttusCustomer;
  amount: number;
  description: string;
}

interface PronttusPaymentResponse {
  transactionId: string;
  pixCode: string;
  pixQrCode: string;
  status: string;
  generatedAt: string;
}

@Injectable()
export class PronttusGateway {
  private readonly baseUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly logger = new Logger(PronttusGateway.name);

  constructor(private configService: ConfigService) {
    const baseUrl = this.configService.get<string>('PRONTTUS_API_URL');
    const clientId = this.configService.get<string>('PRONTTUS_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'PRONTTUS_CLIENT_SECRET',
    );

    if (!baseUrl || !clientId || !clientSecret) {
      this.logger.error('Missing Pronttus API configuration');
      throw new Error('Missing required Pronttus API configuration');
    }

    this.baseUrl = baseUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async createPixPayment(
    name: string,
    document: string,
    email: string,
    phone: string,
    amount: number,
  ): Promise<PronttusPaymentResponse> {
    const paymentData: PronttusPaymentRequest = {
      customer: {
        name,
        document,
        email,
        phone,
      },
      amount,
      description: 'Pagamento via PIX',
    };

    try {
      const response = await axios.post<PronttusPaymentResponse>(
        `${this.baseUrl}/payment`,
        paymentData,
        {
          headers: {
            'x-client-id': this.clientId,
            'x-client-secret': this.clientSecret,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Pronttus API error: ${error.message}`);
      }
      throw error;
    }
  }
}
