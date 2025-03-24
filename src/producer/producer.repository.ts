import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProducerDto } from './dto/create-producer.dto';
import { FiltersAndOrdersProducerDto } from './dto/filter-and-orders-producer.dto';

@Injectable()
export class ProducerRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProducerDto) {
    return this.prisma.producer.create({
      data,
      include: {
        properties: true,
      },
    });
  }

  async findAll(
    where?: Prisma.ProducerWhereInput,
    orderBy?: Prisma.ProducerOrderByWithRelationInput,
    skip?: number,
    take: number = 10,
  ) {
    const [producers, total] = await Promise.all([
      this.prisma.producer.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          properties: true,
        },
      }),
      this.prisma.producer.count({ where }),
    ]);

    return {
      data: producers,
      meta: {
        total,
        page: skip ? Math.floor(skip / take) + 1 : 1,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async findById(id: string) {
    return this.prisma.producer.findUnique({
      where: { id, deletedAt: null },
      include: {
        properties: true,
      },
    });
  }

  async update(id: string, data: { cpf_cnpj?: string; name?: string }) {
    return this.prisma.producer.update({
      where: { id },
      data,
      include: {
        properties: true,
      },
    });
  }

  async softDelete(id: string) {
    return this.prisma.producer.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      include: {
        properties: true,
      },
    });
  }

  async filterProducer(query: FiltersAndOrdersProducerDto) {
    const { page = 1, limit = 10, orders, ...filters } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.ProducerWhereInput = {
      deletedAt: null,
      ...(filters.name && {
        name: {
          contains: filters.name,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
      ...(filters.cpfCnpj && {
        cpf_cnpj: filters.cpfCnpj,
      }),
    };

    const orderBy: Prisma.ProducerOrderByWithRelationInput = {
      ...(orders?.cpfCnpj && { cpfCnpj: orders.cpfCnpj }),
      ...(orders?.name && { name: orders.name }),
      ...(orders?.createdAt && { created_at: orders.createdAt }),
      ...(orders?.updatedAt && { updated_at: orders.updatedAt }),
      ...(orders?.deletedAt && { deleted_at: orders.deletedAt }),
    };

    if (Object.keys(orderBy).length === 0) {
      orderBy.createdAt = 'desc';
    }

    const [producers, total] = await Promise.all([
      this.prisma.producer.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          properties: true,
        },
      }),
      this.prisma.producer.count({ where }),
    ]);

    return {
      data: producers,
      meta: {
        total,
        page: Math.floor(skip / take) + 1,
        lastPage: Math.ceil(total / take),
      },
    };
  }
}
