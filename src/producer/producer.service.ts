import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProducerRepository } from './producer.repository';
import { ValidateCpfCnpj } from 'src/utils/validate-cpf-cnpj';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { FiltersProducerDto } from './dto/filters-producer.dto';
import { OrderProducerDto } from './dto/orders-producer.dto';

@Injectable()
export class ProducerService {
  constructor(private producerRepository: ProducerRepository) {}

  async create(data: CreateProducerDto) {
    if (!ValidateCpfCnpj.isValid(data.cpfCnpj)) {
      throw new BadRequestException('CPF/CNPJ inválido');
    }

    return this.producerRepository.create(data);
  }

  async filterProducer(filters: FiltersProducerDto, orders: OrderProducerDto) {
    return this.producerRepository.filterProducer(filters, orders);
  }

  async findOne(id: string) {
    const producer = await this.producerRepository.findById(id);

    if (!producer || producer.deletedAt) {
      throw new NotFoundException('Produtor não encontrado');
    }

    return producer;
  }

  async update(id: string, data: UpdateProducerDto) {
    if (data.cpfCnpj && !ValidateCpfCnpj.isValid(data.cpfCnpj)) {
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
