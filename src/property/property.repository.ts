import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreatePropertyDto } from './dto/create-property.dto';
import { OrderPropertyDto } from './dto/filter-and-orders-property.dto';
import { FiltersPropertyDto } from './dto/filters-property.dto';

@Injectable()
export class PropertyRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePropertyDto) {
    return await this.prisma.property.create({
      data,
      include: {
        producer: true,
        harvests: true,
      },
    });
  }

  async findAll(filters: FiltersPropertyDto, orders?: OrderPropertyDto) {
    const { page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.PropertyWhereInput = {
      deletedAt: null,
      ...(filters.name && {
        name: {
          contains: filters.name,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
      ...(filters.city && {
        city: {
          contains: filters.city,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
      ...(filters.state && { state: filters.state }),
    };

    const orderBy: Prisma.PropertyOrderByWithRelationInput = {
      ...(orders?.name && { name: orders.name }),
      ...(orders?.city && { city: orders.city }),
      ...(orders?.state && { state: orders.state }),
      ...(orders?.createdAt && { created_at: orders.createdAt }),
    };

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
    return await this.prisma.property.update({
      where: { id },
      data,
      include: {
        producer: true,
        harvests: true,
      },
    });
  }

  async softDelete(id: string) {
    return await this.prisma.property.update({
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
