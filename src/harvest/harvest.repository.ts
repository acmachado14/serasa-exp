import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { CreateCropDto } from './dto/create-crop.dto';

@Injectable()
export class HarvestRepository {
  constructor(private prisma: PrismaService) {}

  async create(createHarvestDto: CreateHarvestDto) {
    return await this.prisma.harvest.create({
      data: {
        year: createHarvestDto.year,
        propertyId: createHarvestDto.propertyId,
      },
      include: {
        property: true,
        crops: true,
      },
    });
  }

  async findAll(propertyId?: string) {
    return await this.prisma.harvest.findMany({
      where: {
        ...(propertyId ? { propertyId } : {}),
        deletedAt: null,
      },
      include: {
        property: true,
        crops: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.harvest.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        property: true,
        crops: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.harvest.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async addCrop(createCropDto: CreateCropDto) {
    return await this.prisma.crop.create({
      data: {
        name: createCropDto.name,
        harvestId: createCropDto.harvestId,
      },
    });
  }

  async removeCrop(id: string) {
    return await this.prisma.crop.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async getDashboardData() {
    const [totalHarvests, totalCrops, cropsByType] = await Promise.all([
      this.prisma.harvest.count(),
      this.prisma.crop.count(),
      this.prisma.crop.groupBy({
        by: ['name'],
        _count: true,
      }),
    ]);

    const cropsByState = await this.prisma.harvest.findMany({
      select: {
        property: {
          select: {
            state: true,
          },
        },
      },
    });

    const stateCount = cropsByState.reduce((acc, curr) => {
      acc[curr.property.state] = (acc[curr.property.state] || 0) + 1;
      return acc;
    }, {});

    return {
      totalHarvests,
      totalCrops,
      cropsByState: Object.entries(stateCount).map(([state, count]) => ({
        state,
        _count: count,
      })),
      cropsByType,
    };
  }

  async findOneCrop(id: string) {
    return await this.prisma.crop.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }
}
