import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PropertyRepository } from './property.repository';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ProducerRepository } from 'src/producer/producer.repository';
import { FiltersPropertyDto } from './dto/filters-property.dto';
import { OrderPropertyDto } from './dto/filter-and-orders-property.dto';
import { EncryptionService } from 'src/utils/encryption';

@Injectable()
export class PropertyService {
  constructor(
    private propertyRepository: PropertyRepository,
    private producerRepository: ProducerRepository,
    private encryptionService: EncryptionService,
  ) {}

  async create(data: CreatePropertyDto) {
    if (data.agriculturalArea + data.vegetationArea > data.totalArea) {
      throw new BadRequestException(
        'A soma das áreas agrícola e de vegetação não pode ser maior que a área total',
      );
    }

    const producer = await this.producerRepository.findById(data.producerId);
    if (!producer) {
      throw new BadRequestException('Produtor não existente');
    }

    const property = await this.propertyRepository.create(data);

    if (property.producer) {
      property.producer.cpfCnpj = this.encryptionService.decrypt(
        property.producer.cpfCnpj,
      );
    }

    return property;
  }

  async filterProperty(filters: FiltersPropertyDto, orders?: OrderPropertyDto) {
    const properties = await this.propertyRepository.findAll(filters, orders);

    if (properties.data) {
      properties.data.forEach((property) => {
        if (property.producer) {
          property.producer.cpfCnpj = this.encryptionService.decrypt(
            property.producer.cpfCnpj,
          );
        }
      });
    }

    return properties;
  }

  async findOne(id: string) {
    const property = await this.propertyRepository.findById(id);

    if (!property || property.deletedAt) {
      throw new NotFoundException('Propriedade não encontrada');
    }

    if (property.producer) {
      property.producer.cpfCnpj = this.encryptionService.decrypt(
        property.producer.cpfCnpj,
      );
    }

    return property;
  }

  async update(id: string, data: UpdatePropertyDto) {
    const property = await this.findOne(id);

    const newAgriculturalArea =
      data.agriculturalArea ?? property.agriculturalArea;
    const newVegetationArea = data.vegetationArea ?? property.vegetationArea;
    const newTotalArea = data.totalArea ?? property.totalArea;

    if (newAgriculturalArea + newVegetationArea > newTotalArea) {
      throw new BadRequestException(
        'A soma das áreas agrícola e de vegetação não pode ser maior que a área total',
      );
    }

    const producerId = data.producerId ?? property.producerId;
    const producer = await this.producerRepository.findById(producerId);
    if (!producer) {
      throw new BadRequestException('Produtor não existente');
    }

    const propertyUpdated = await this.propertyRepository.update(id, data);

    if (propertyUpdated.producer) {
      propertyUpdated.producer.cpfCnpj = this.encryptionService.decrypt(
        propertyUpdated.producer.cpfCnpj,
      );
    }

    return propertyUpdated;
  }

  async remove(id: string) {
    await this.findOne(id);

    const propertyRemoved = await this.propertyRepository.softDelete(id);

    if (propertyRemoved.producer) {
      propertyRemoved.producer.cpfCnpj = this.encryptionService.decrypt(
        propertyRemoved.producer.cpfCnpj,
      );
    }

    return propertyRemoved;
  }
}
