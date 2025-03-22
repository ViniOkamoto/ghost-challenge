import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ApprovePaymentDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of the transaction to approve',
  })
  @IsUUID(4, { message: 'Transaction ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Transaction ID is required' })
  id_transacao: string;
}
