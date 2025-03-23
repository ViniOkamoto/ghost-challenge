import { ApiProperty } from '@nestjs/swagger';

export class CheckoutResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id_transacao: string;

  @ApiProperty({ example: 30200.0 })
  valor: number;

  @ApiProperty({ example: 'data:image/png;base64,...' })
  pix_qr_code?: string;

  @ApiProperty({
    example: '00020126850014br.gov.bcb.pix2563pix.voluti.com.br/...',
  })
  pix_code?: string;

  @ApiProperty({ example: 'PENDING' })
  status: string;

  @ApiProperty({ example: '2025-03-20T08:17:00Z' })
  prazo_pagamento: string;
}
