import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

enum PaymentMethod {
  PIX = 'pix',
  CREDIT_CARD = 'credit_card',
}

export class CreatePaymentDto {
  @ApiProperty({ example: 'João Almeida' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'joaoalmeida22@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '19995424903' })
  @IsString()
  @IsNotEmpty()
  telefone: string;

  @ApiProperty({ example: '42446021243' })
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({ example: 3050000, description: 'Value in cents' })
  @IsNumber()
  @Min(1)
  valor: number;

  @ApiProperty({ enum: PaymentMethod, example: 'pix' })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  metodo_pagamento: string;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Number of installments for credit card payments',
    minimum: 1,
    maximum: 12,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(12)
  parcelas?: number;
}
