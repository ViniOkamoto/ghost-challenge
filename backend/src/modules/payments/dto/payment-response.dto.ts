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

export class PaymentStatusDto {
  @ApiProperty({ example: 'APPROVED' })
  status: string;

  @ApiProperty({ example: 'João Almeida' })
  nome: string;

  @ApiProperty({ example: 'joaoalmeida22@gmail.com' })
  email: string;

  @ApiProperty({ example: '19995424903' })
  telefone: string;

  @ApiProperty({ example: '42446021243' })
  cpf: string;

  @ApiProperty({ example: 3050000 })
  valor_total: number;

  @ApiProperty({ example: 3020000 })
  valor_pago: number;

  @ApiProperty({ example: 'pix' })
  metodo_pagamento: string;

  @ApiProperty({ example: 1 })
  parcelas: number;

  @ApiProperty({ example: '2c1b951f356c4680b13ba1c9fc889c47' })
  id_transacao: string;
}
