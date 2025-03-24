import { Module } from '@nestjs/common';
import { HarvestService } from './harvest.service';
import { HarvestController } from './harvest.controller';
import { HarvestRepository } from './harvest.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PropertyModule } from '../property/property.module';

@Module({
  imports: [PrismaModule, PropertyModule],
  controllers: [HarvestController],
  providers: [HarvestService, HarvestRepository],
  exports: [HarvestService],
})
export class HarvestModule {}
