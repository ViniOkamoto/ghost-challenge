import { ApiProperty } from '@nestjs/swagger';

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
