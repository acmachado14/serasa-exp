import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { CreateCropDto } from './dto/create-crop.dto';
import { HarvestRepository } from './harvest.repository';

@Injectable()
export class HarvestService {
  constructor(private readonly harvestRepository: HarvestRepository) {}

  async create(createHarvestDto: CreateHarvestDto) {
    return this.harvestRepository.create(createHarvestDto);
  }

  async findAll(propertyId?: string) {
    return this.harvestRepository.findAll(propertyId);
  }

  async findOne(id: string) {
    const harvest = await this.harvestRepository.findOne(id);

    if (!harvest) {
      throw new NotFoundException('Safra não encontrada');
    }

    return harvest;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.harvestRepository.remove(id);
  }

  async addCrop(createCropDto: CreateCropDto) {
    await this.findOne(createCropDto.harvestId);
    return await this.harvestRepository.addCrop(createCropDto);
  }

  async removeCrop(id: string) {
    await this.findOneCrop(id);
    return this.harvestRepository.removeCrop(id);
  }

  async getDashboardData() {
    return this.harvestRepository.getDashboardData();
  }

  async findOneCrop(id: string) {
    const crop = await this.harvestRepository.findOneCrop(id);
    if (!crop) {
      throw new NotFoundException('Cultura não encontrada');
    }
    return crop;
  }
}
