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

@Injectable()
export class PropertyService {
  constructor(
    private propertyRepository: PropertyRepository,
    private producerRepository: ProducerRepository,
  ) {}

  async create(data: CreatePropertyDto) {
    if (data.agriculturalArea + data.vegetationArea > data.totalArea) {
      throw new BadRequestException(
        'A soma das áreas agrícola e de vegetação não pode ser maior que a área total',
      );
    }

    if (!(await this.producerRepository.findById(data.producerId))) {
      throw new BadRequestException('Produtor não existente');
    }

    return await this.propertyRepository.create(data);
  }

  async filterProperty(filters: FiltersPropertyDto, orders?: OrderPropertyDto) {
    return this.propertyRepository.findAll(filters, orders);
  }

  async findOne(id: string) {
    const property = await this.propertyRepository.findById(id);

    if (!property || property.deletedAt) {
      throw new NotFoundException('Propriedade não encontrada');
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
    if (!(await this.producerRepository.findById(producerId))) {
      throw new BadRequestException('Produtor não existente');
    }

    return await this.propertyRepository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.propertyRepository.softDelete(id);
  }
}
