import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApprovePaymentDto } from './dto/approve-payment.dto';
import { PaymentStatusDto } from './dto/payment-status.dto';
import { CheckoutResponseDto } from './dto/checkout-response.dto';

@ApiTags('payments')
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Create a new payment order' })
  @ApiResponse({
    status: 201,
    description: 'Payment order created successfully',
    type: CheckoutResponseDto,
  })
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<CheckoutResponseDto> {
    return this.paymentsService.createPayment(createPaymentDto);
  }

  @Post('payment/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve a pending payment' })
  @ApiResponse({ status: 200, description: 'Payment approved successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async approvePayment(
    @Body() approvePaymentDto: ApprovePaymentDto,
  ): Promise<{ message: string }> {
    await this.paymentsService.approvePayment(approvePaymentDto);
    return { message: 'Payment approved successfully' };
  }

  @Get('payment/:order_id')
  @ApiOperation({ summary: 'Get payment status and details' })
  @ApiResponse({
    status: 200,
    description: 'Payment details',
    type: PaymentStatusDto,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async getPaymentStatus(
    @Param('order_id') orderId: string,
  ): Promise<PaymentStatusDto> {
    return this.paymentsService.getPaymentStatus(orderId);
  }
}
