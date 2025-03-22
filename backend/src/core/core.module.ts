import { Module } from '@nestjs/common';
import { PrismaModule } from './db/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [PrismaModule],
})
export class CoreModule {}
