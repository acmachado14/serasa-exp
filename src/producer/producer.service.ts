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
import { EncryptionService } from 'src/utils/encryption';

@Injectable()
export class ProducerService {
  constructor(
    private producerRepository: ProducerRepository,
    private encryptionService: EncryptionService,
  ) {}

  async create(data: CreateProducerDto) {
    if (!ValidateCpfCnpj.isValid(data.cpfCnpj)) {
      throw new BadRequestException('CPF/CNPJ inválido');
    }
    data.cpfCnpj = this.encryptionService.encrypt(data.cpfCnpj);
    const producer = await this.producerRepository.create(data);
    producer.cpfCnpj = this.encryptionService.decrypt(producer.cpfCnpj);
    return producer;
  }

  async filterProducer(filters: FiltersProducerDto, orders: OrderProducerDto) {
    const produceres = await this.producerRepository.filterProducer(
      filters,
      orders,
    );

    produceres.data.forEach((producer) => {
      producer.cpfCnpj = this.encryptionService.decrypt(producer.cpfCnpj);
    });

    return produceres;
  }

  async findOne(id: string) {
    const producer = await this.producerRepository.findById(id);

    if (!producer || producer.deletedAt) {
      throw new NotFoundException('Produtor não encontrado');
    }

    producer.cpfCnpj = this.encryptionService.decrypt(producer.cpfCnpj);
    return producer;
  }

  async update(id: string, data: UpdateProducerDto) {
    if (data.cpfCnpj && !ValidateCpfCnpj.isValid(data.cpfCnpj)) {
      throw new BadRequestException('CPF/CNPJ inválido');
    }

    if (data.cpfCnpj) {
      data.cpfCnpj = this.encryptionService.encrypt(data.cpfCnpj);
    }

    await this.findOne(id);
    const producer = await this.producerRepository.update(id, data);
    producer.cpfCnpj = this.encryptionService.decrypt(producer.cpfCnpj);
    return producer;
  }

  async remove(id: string) {
    await this.findOne(id);
    const producer = await this.producerRepository.softDelete(id);
    producer.cpfCnpj = this.encryptionService.decrypt(producer.cpfCnpj);
    return producer;
  }
}
