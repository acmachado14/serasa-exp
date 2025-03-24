import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreatePropertyDto } from './dto/create-property.dto';

@Injectable()
export class PropertyRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePropertyDto) {
    return this.prisma.property.create({
      data,
      include: {
        producer: true,
        harvests: true,
      },
    });
  }

  async findAll(
    where?: Prisma.PropertyWhereInput,
    orderBy?: Prisma.PropertyOrderByWithRelationInput,
    skip?: number,
    take: number = 10,
  ) {
    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          producer: true,
          harvests: true,
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      data: properties,
      meta: {
        total,
        page: skip ? Math.floor(skip / take) + 1 : 1,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async findById(id: string) {
    return this.prisma.property.findUnique({
      where: { id },
      include: {
        producer: true,
        harvests: true,
      },
    });
  }

  async update(id: string, data: Prisma.PropertyUpdateInput) {
    return this.prisma.property.update({
      where: { id },
      data,
      include: {
        producer: true,
        harvests: true,
      },
    });
  }

  async softDelete(id: string) {
    return this.prisma.property.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      include: {
        producer: true,
        harvests: true,
      },
    });
  }
}
