import { Module } from '@nestjs/common';
import { HarvestService } from './harvest.service';
import { HarvestController } from './harvest.controller';
import { HarvestRepository } from './harvest.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HarvestController],
  providers: [HarvestService, HarvestRepository],
  exports: [HarvestService],
})
export class HarvestModule {}
