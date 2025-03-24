import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PropertyRepository } from './property.repository';
import { ProducerRepository } from '../producer/producer.repository';
import { EncryptionService } from 'src/utils/encryption';

@Module({
  imports: [PrismaModule],
  controllers: [PropertyController],
  providers: [
    PropertyService,
    PropertyRepository,
    ProducerRepository,
    EncryptionService,
  ],
  exports: [PropertyRepository],
})
export class PropertyModule {}
