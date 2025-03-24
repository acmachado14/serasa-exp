import { Module } from '@nestjs/common';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProducerRepository } from './producer.repository';
import { EncryptionService } from 'src/utils/encryption';

@Module({
  imports: [PrismaModule],
  controllers: [ProducerController],
  providers: [ProducerService, ProducerRepository, EncryptionService],
})
export class ProducerModule {}
