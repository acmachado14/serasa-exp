import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PropertyRepository } from './property.repository';
import { CreatePropertyDto } from './dto/create-property.dto';

import { Prisma } from '@prisma/client';
import { FiltersAndOrdersPropertyDto } from './dto/filter-and-orders-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertyService {
  constructor(private propertyRepository: PropertyRepository) {}

  async create(data: CreatePropertyDto) {
    if (data.agriculturalArea + data.vegetationArea > data.totalArea) {
      throw new BadRequestException(
        'A soma das áreas agrícola e de vegetação não pode ser maior que a área total',
      );
    }

    return this.propertyRepository.create(data);
  }

  async filterProperty(query: FiltersAndOrdersPropertyDto) {
    const { page = 1, limit = 10, orders, ...filters } = query;
    const skip = (page - 1) * limit;

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

    return this.propertyRepository.findAll(where, orderBy, skip, limit);
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

    return this.propertyRepository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.propertyRepository.softDelete(id);
  }
}
