import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProducerDto } from './dto/create-producer.dto';

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
      where: { id },
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

  async filterProducer(
    where: Prisma.ProducerWhereInput,
    orderBy: Prisma.ProducerOrderByWithRelationInput,
    skip: number,
    take: number,
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
        page: Math.floor(skip / take) + 1,
        lastPage: Math.ceil(total / take),
      },
    };
  }
}
