import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProducerRepository } from './producer.repository';
import { ValidateCpfCnpj } from 'src/utils/validate-cpf-cnpj';
import { Prisma } from '@prisma/client';
import { FiltersAndOrdersProducerDto } from './dto/filter-and-orders-producer.dto';
import { CreateProducerDto } from './dto/create-producer.dto';

@Injectable()
export class ProducerService {
  constructor(private producerRepository: ProducerRepository) {}

  async create(data: CreateProducerDto) {
    if (!ValidateCpfCnpj.isValid(data.cpfCnpj)) {
      throw new BadRequestException('CPF/CNPJ inválido');
    }

    return this.producerRepository.create(data);
  }

  async filterProducer(query: FiltersAndOrdersProducerDto) {
    const { page = 1, limit = 10, orders, ...filters } = query;
    const skip = (page - 1) * limit;

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

    return this.producerRepository.filterProducer(where, orderBy, skip, limit);
  }

  async findOne(id: string) {
    const producer = await this.producerRepository.findById(id);

    if (!producer || producer.deletedAt) {
      throw new NotFoundException('Produtor não encontrado');
    }

    return producer;
  }

  async update(id: string, data: { cpf_cnpj?: string; name?: string }) {
    if (data.cpf_cnpj && !ValidateCpfCnpj.isValid(data.cpf_cnpj)) {
      throw new BadRequestException('CPF/CNPJ inválido');
    }

    await this.findOne(id);

    return this.producerRepository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.producerRepository.softDelete(id);
  }
}
