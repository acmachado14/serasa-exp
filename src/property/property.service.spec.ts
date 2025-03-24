import { Test, TestingModule } from '@nestjs/testing';
import { PropertyService } from './property.service';
import { PropertyRepository } from './property.repository';
import { ProducerRepository } from '../producer/producer.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { FiltersPropertyDto } from './dto/filters-property.dto';
import { OrderPropertyDto } from './dto/filter-and-orders-property.dto';

describe('PropertyService', () => {
  let service: PropertyService;
  let repository: PropertyRepository;

  const mockPropertyRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockProducerRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyService,
        {
          provide: PropertyRepository,
          useValue: mockPropertyRepository,
        },
        {
          provide: ProducerRepository,
          useValue: mockProducerRepository,
        },
      ],
    }).compile();

    service = module.get<PropertyService>(PropertyService);
    repository = module.get<PropertyRepository>(PropertyRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a property with valid areas', async () => {
      const createPropertyDto: CreatePropertyDto = {
        name: 'Test Property',
        city: 'Test City',
        state: 'SP',
        totalArea: 100,
        agriculturalArea: 80,
        vegetationArea: 20,
        producerId: '1',
      };

      mockProducerRepository.findById.mockResolvedValue({
        id: '1',
        name: 'Test Producer',
        cpfCnpj: '12345678901',
      });

      mockPropertyRepository.create.mockResolvedValue({
        id: '1',
        ...createPropertyDto,
      });

      const result = await service.create(createPropertyDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(createPropertyDto.name);
      expect(result.totalArea).toBe(createPropertyDto.totalArea);
      expect(result.agriculturalArea).toBe(createPropertyDto.agriculturalArea);
      expect(result.vegetationArea).toBe(createPropertyDto.vegetationArea);
      expect(repository.create).toHaveBeenCalledWith(createPropertyDto);
    });

    it('should throw BadRequestException for invalid area constraints', async () => {
      const createPropertyDto: CreatePropertyDto = {
        name: 'Test Property',
        city: 'Test City',
        state: 'SP',
        totalArea: 100,
        agriculturalArea: 90,
        vegetationArea: 20,
        producerId: '1',
      };

      mockProducerRepository.findById.mockResolvedValue({
        id: '1',
        name: 'Test Producer',
        cpfCnpj: '12345678901',
      });

      await expect(service.create(createPropertyDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a property when found', async () => {
      const property = {
        id: '1',
        name: 'Test Property',
        city: 'Test City',
        state: 'SP',
        totalArea: 100,
        agriculturalArea: 80,
        vegetationArea: 20,
        producerId: '1',
      };

      mockPropertyRepository.findById.mockResolvedValue(property);

      const result = await service.findOne('1');

      expect(result).toBeDefined();
      expect(result).toEqual(property);
    });

    it('should throw NotFoundException when property not found', async () => {
      mockPropertyRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a property with valid data', async () => {
      const updateData = {
        name: 'Updated Property',
        city: 'Updated City',
      };

      mockPropertyRepository.findById.mockResolvedValue({
        id: '1',
        name: 'Test Property',
        city: 'Test City',
        state: 'SP',
        totalArea: 100,
        agriculturalArea: 80,
        vegetationArea: 20,
        producerId: '1',
      });

      mockPropertyRepository.update.mockResolvedValue({
        id: '1',
        ...updateData,
      });

      const result = await service.update('1', updateData);

      expect(result).toBeDefined();
      expect(result.name).toBe(updateData.name);
      expect(result.city).toBe(updateData.city);
    });

    it('should throw BadRequestException for invalid area constraints', async () => {
      const updateData = {
        agriculturalArea: 90,
        vegetationArea: 20,
      };

      mockPropertyRepository.findById.mockResolvedValue({
        id: '1',
        name: 'Test Property',
        city: 'Test City',
        state: 'SP',
        totalArea: 100,
        agriculturalArea: 80,
        vegetationArea: 20,
        producerId: '1',
      });

      await expect(service.update('1', updateData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a property', async () => {
      mockPropertyRepository.findById.mockResolvedValue({
        id: '1',
        name: 'Test Property',
        city: 'Test City',
        state: 'SP',
        totalArea: 100,
        agriculturalArea: 80,
        vegetationArea: 20,
        producerId: '1',
      });

      mockPropertyRepository.softDelete.mockResolvedValue({
        id: '1',
        deletedAt: new Date(),
      });

      const result = await service.remove('1');

      expect(result).toBeDefined();
      expect(result.deletedAt).toBeDefined();
      expect(repository.softDelete).toHaveBeenCalledWith('1');
    });
  });

  describe('filterProperty', () => {
    it('should filter properties with valid parameters', async () => {
      const filters: FiltersPropertyDto = {
        page: 1,
        limit: 10,
        state: 'SP',
      };

      const orders: OrderPropertyDto = {
        name: 'asc',
      };

      const mockResult = {
        data: [
          {
            id: '1',
            name: 'Test Property',
            state: 'SP',
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
        },
      };

      mockPropertyRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.filterProperty(filters, orders);

      expect(result).toBeDefined();
      expect(result.data).toEqual(mockResult.data);
      expect(result.meta).toEqual(mockResult.meta);
      expect(repository.findAll).toHaveBeenCalledWith(filters, orders);
    });
  });
});
