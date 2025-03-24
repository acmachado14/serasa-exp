import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PropertyRepository } from './property.repository';
import { ProducerRepository } from 'src/producer/producer.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PropertyController],
  providers: [PropertyService, PropertyRepository, ProducerRepository],
})
export class PropertyModule {}
