import { Test, TestingModule } from '@nestjs/testing';
import { PropertyService } from './property.service';
import { PropertyRepository } from './property.repository';
import { ProducerRepository } from '../producer/producer.repository';
import { EncryptionService } from '../utils/encryption';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { FiltersPropertyDto } from './dto/filters-property.dto';
import { OrderPropertyDto } from './dto/filter-and-orders-property.dto';

describe('PropertyService', () => {
  let service: PropertyService;
  let repository: PropertyRepository;
  let encryptionService: EncryptionService;

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

  const mockEncryptionService = {
    encrypt: jest.fn(),
    decrypt: jest.fn().mockImplementation((text) => text),
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
        {
          provide: EncryptionService,
          useValue: mockEncryptionService,
        },
      ],
    }).compile();

    service = module.get<PropertyService>(PropertyService);
    repository = module.get<PropertyRepository>(PropertyRepository);
    encryptionService = module.get<EncryptionService>(EncryptionService);
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

      const mockProducer = {
        id: '1',
        name: 'Test Producer',
        cpfCnpj: '12345678901',
      };

      mockProducerRepository.findById.mockResolvedValue(mockProducer);

      const mockProperty = {
        id: '1',
        ...createPropertyDto,
        producer: mockProducer,
      };

      mockPropertyRepository.create.mockResolvedValue(mockProperty);

      const result = await service.create(createPropertyDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(createPropertyDto.name);
      expect(result.totalArea).toBe(createPropertyDto.totalArea);
      expect(result.agriculturalArea).toBe(createPropertyDto.agriculturalArea);
      expect(result.vegetationArea).toBe(createPropertyDto.vegetationArea);
      expect(result.producer).toBeDefined();
      expect(result.producer.cpfCnpj).toBe(mockProducer.cpfCnpj);
      expect(repository.create).toHaveBeenCalledWith(createPropertyDto);
      expect(encryptionService.decrypt).toHaveBeenCalledWith(
        mockProducer.cpfCnpj,
      );
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
      const mockProducer = {
        id: '1',
        name: 'Test Producer',
        cpfCnpj: '12345678901',
      };

      const property = {
        id: '1',
        name: 'Test Property',
        city: 'Test City',
        state: 'SP',
        totalArea: 100,
        agriculturalArea: 80,
        vegetationArea: 20,
        producerId: '1',
        producer: mockProducer,
      };

      mockPropertyRepository.findById.mockResolvedValue(property);

      const result = await service.findOne('1');

      expect(result).toBeDefined();
      expect(result).toEqual(property);
      expect(result.producer).toBeDefined();
      expect(result.producer.cpfCnpj).toBe(mockProducer.cpfCnpj);
      expect(encryptionService.decrypt).toHaveBeenCalledWith(
        mockProducer.cpfCnpj,
      );
    });

    it('should throw NotFoundException when property not found', async () => {
      mockPropertyRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a property with valid data', async () => {
      const mockProducer = {
        id: '1',
        name: 'Test Producer',
        cpfCnpj: '12345678901',
      };

      const updateData = {
        name: 'Updated Property',
        city: 'Updated City',
      };

      const existingProperty = {
        id: '1',
        name: 'Test Property',
        city: 'Test City',
        state: 'SP',
        totalArea: 100,
        agriculturalArea: 80,
        vegetationArea: 20,
        producerId: '1',
        producer: mockProducer,
      };

      mockPropertyRepository.findById.mockResolvedValue(existingProperty);
      mockProducerRepository.findById.mockResolvedValue(mockProducer);

      const updatedProperty = {
        ...existingProperty,
        ...updateData,
        producer: mockProducer,
      };

      mockPropertyRepository.update.mockResolvedValue(updatedProperty);

      const result = await service.update('1', updateData);

      expect(result).toBeDefined();
      expect(result.name).toBe(updateData.name);
      expect(result.city).toBe(updateData.city);
      expect(result.producer).toBeDefined();
      expect(result.producer.cpfCnpj).toBe(mockProducer.cpfCnpj);
      expect(encryptionService.decrypt).toHaveBeenCalledWith(
        mockProducer.cpfCnpj,
      );
    });

    it('should throw BadRequestException for invalid area constraints', async () => {
      const updateData = {
        agriculturalArea: 90,
        vegetationArea: 20,
      };

      const mockProducer = {
        id: '1',
        name: 'Test Producer',
        cpfCnpj: '12345678901',
      };

      const existingProperty = {
        id: '1',
        name: 'Test Property',
        city: 'Test City',
        state: 'SP',
        totalArea: 100,
        agriculturalArea: 80,
        vegetationArea: 20,
        producerId: '1',
        producer: mockProducer,
      };

      mockPropertyRepository.findById.mockResolvedValue(existingProperty);
      mockProducerRepository.findById.mockResolvedValue(mockProducer);

      await expect(service.update('1', updateData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a property', async () => {
      const mockProducer = {
        id: '1',
        name: 'Test Producer',
        cpfCnpj: '12345678901',
      };

      const existingProperty = {
        id: '1',
        name: 'Test Property',
        city: 'Test City',
        state: 'SP',
        totalArea: 100,
        agriculturalArea: 80,
        vegetationArea: 20,
        producerId: '1',
        producer: mockProducer,
      };

      mockPropertyRepository.findById.mockResolvedValue(existingProperty);

      const removedProperty = {
        ...existingProperty,
        deletedAt: new Date(),
      };

      mockPropertyRepository.softDelete.mockResolvedValue(removedProperty);

      const result = await service.remove('1');

      expect(result).toBeDefined();
      expect(result.deletedAt).toBeDefined();
      expect(result.producer).toBeDefined();
      expect(result.producer.cpfCnpj).toBe(mockProducer.cpfCnpj);
      expect(encryptionService.decrypt).toHaveBeenCalledWith(
        mockProducer.cpfCnpj,
      );
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

      const mockProducer = {
        id: '1',
        name: 'Test Producer',
        cpfCnpj: '12345678901',
      };

      const mockResult = {
        data: [
          {
            id: '1',
            name: 'Test Property',
            state: 'SP',
            producer: mockProducer,
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
      expect(result.data[0].producer).toBeDefined();
      expect(result.data[0].producer.cpfCnpj).toBe(mockProducer.cpfCnpj);
      expect(encryptionService.decrypt).toHaveBeenCalledWith(
        mockProducer.cpfCnpj,
      );
      expect(repository.findAll).toHaveBeenCalledWith(filters, orders);
    });
  });
});
