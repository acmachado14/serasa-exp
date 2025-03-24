import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProducerRepository } from './producer.repository';
import { ValidateCpfCnpj } from 'src/utils/validate-cpf-cnpj';
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
    return this.producerRepository.filterProducer(query);
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
