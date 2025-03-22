import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [PaymentsModule],
  exports: [PaymentsModule],
})
export class ModulesModule {}
