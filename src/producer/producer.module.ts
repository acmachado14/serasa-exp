import { Module } from '@nestjs/common';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProducerRepository } from './producer.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ProducerController],
  providers: [ProducerService, ProducerRepository],
})
export class ProducerModule {}
