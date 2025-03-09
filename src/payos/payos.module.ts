import { Module } from '@nestjs/common';
import { PayosService } from './payos.service';
import { PayosController } from './payos.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [PayosController],
  providers: [PayosService],
  exports: [PayosService],
})
export class PayosModule {}
