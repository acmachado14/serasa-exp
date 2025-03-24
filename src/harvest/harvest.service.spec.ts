import { Test, TestingModule } from '@nestjs/testing';
import { HarvestService } from './harvest.service';
import { HarvestRepository } from './harvest.repository';
import { PropertyRepository } from '../property/property.repository';
import { EncryptionService } from '../utils/encryption';
import { NotFoundException } from '@nestjs/common';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { CreateCropDto } from './dto/create-crop.dto';

describe('HarvestService', () => {
  let service: HarvestService;
  let repository: HarvestRepository;
  let propertyRepository: PropertyRepository;

  const mockHarvestRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    addCrop: jest.fn(),
    removeCrop: jest.fn(),
    getDashboardData: jest.fn(),
    findOneCrop: jest.fn(),
  };

  const mockPropertyRepository = {
    findById: jest.fn(),
  };

  const mockEncryptionService = {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestService,
        {
          provide: HarvestRepository,
          useValue: mockHarvestRepository,
        },
        {
          provide: PropertyRepository,
          useValue: mockPropertyRepository,
        },
        {
          provide: EncryptionService,
          useValue: mockEncryptionService,
        },
      ],
    }).compile();

    service = module.get<HarvestService>(HarvestService);
    repository = module.get<HarvestRepository>(HarvestRepository);
    propertyRepository = module.get<PropertyRepository>(PropertyRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a harvest', async () => {
      const createHarvestDto: CreateHarvestDto = {
        year: 2024,
        propertyId: '1',
      };

      mockPropertyRepository.findById.mockResolvedValue({
        id: '1',
        name: 'Test Property',
      });

      mockHarvestRepository.create.mockResolvedValue({
        id: '1',
        ...createHarvestDto,
        property: { id: '1', name: 'Test Property' },
        crops: [],
      });

      const result = await service.create(createHarvestDto);

      expect(result).toBeDefined();
      expect(result.year).toBe(createHarvestDto.year);
      expect(result.propertyId).toBe(createHarvestDto.propertyId);
      expect(propertyRepository.findById).toHaveBeenCalledWith(
        createHarvestDto.propertyId,
      );
      expect(repository.create).toHaveBeenCalledWith(createHarvestDto);
    });

    it('should throw NotFoundException when property not found', async () => {
      const createHarvestDto: CreateHarvestDto = {
        year: 2024,
        propertyId: '1',
      };

      mockPropertyRepository.findById.mockResolvedValue(null);

      await expect(service.create(createHarvestDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(propertyRepository.findById).toHaveBeenCalledWith(
        createHarvestDto.propertyId,
      );
    });
  });

  describe('findAll', () => {
    it('should return all harvests', async () => {
      const mockHarvests = [
        {
          id: '1',
          year: 2024,
          propertyId: '1',
          property: { id: '1', name: 'Test Property' },
          crops: [],
        },
      ];

      mockHarvestRepository.findAll.mockResolvedValue(mockHarvests);

      const result = await service.findAll();

      expect(result).toBeDefined();
      expect(result).toEqual(mockHarvests);
      expect(repository.findAll).toHaveBeenCalled();
    });

    it('should return harvests filtered by propertyId', async () => {
      const propertyId = '1';
      const mockHarvests = [
        {
          id: '1',
          year: 2024,
          propertyId: '1',
          property: { id: '1', name: 'Test Property' },
          crops: [],
        },
      ];

      mockHarvestRepository.findAll.mockResolvedValue(mockHarvests);

      const result = await service.findAll(propertyId);

      expect(result).toBeDefined();
      expect(result).toEqual(mockHarvests);
      expect(repository.findAll).toHaveBeenCalledWith(propertyId);
    });
  });

  describe('findOne', () => {
    it('should return a harvest when found', async () => {
      const mockHarvest = {
        id: '1',
        year: 2024,
        propertyId: '1',
        property: { id: '1', name: 'Test Property' },
        crops: [],
      };

      mockHarvestRepository.findOne.mockResolvedValue(mockHarvest);

      const result = await service.findOne('1');

      expect(result).toBeDefined();
      expect(result).toEqual(mockHarvest);
    });

    it('should throw NotFoundException when harvest not found', async () => {
      mockHarvestRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a harvest', async () => {
      mockHarvestRepository.findOne.mockResolvedValue({
        id: '1',
        year: 2024,
        propertyId: '1',
      });

      mockHarvestRepository.remove.mockResolvedValue({
        id: '1',
        deletedAt: new Date(),
      });

      const result = await service.remove('1');

      expect(result).toBeDefined();
      expect(result.deletedAt).toBeDefined();
      expect(repository.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('addCrop', () => {
    it('should add a crop to a harvest', async () => {
      const createCropDto: CreateCropDto = {
        name: 'Soja',
        harvestId: '1',
      };

      mockHarvestRepository.findOne.mockResolvedValue({
        id: '1',
        year: 2024,
        propertyId: '1',
      });

      mockHarvestRepository.addCrop.mockResolvedValue({
        id: '1',
        ...createCropDto,
      });

      const result = await service.addCrop(createCropDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(createCropDto.name);
      expect(result.harvestId).toBe(createCropDto.harvestId);
      expect(repository.addCrop).toHaveBeenCalledWith(createCropDto);
    });
  });

  describe('removeCrop', () => {
    it('should remove a crop', async () => {
      mockHarvestRepository.findOneCrop.mockResolvedValue({
        id: '1',
        name: 'Soja',
        harvestId: '1',
      });

      mockHarvestRepository.removeCrop.mockResolvedValue({
        id: '1',
        deletedAt: new Date(),
      });

      const result = await service.removeCrop('1');

      expect(result).toBeDefined();
      expect(result.deletedAt).toBeDefined();
      expect(repository.removeCrop).toHaveBeenCalledWith('1');
    });
  });

  describe('getDashboardData', () => {
    it('should return dashboard data', async () => {
      const mockDashboardData = {
        totalHarvests: 1,
        totalCrops: 2,
        cropsByState: [{ state: 'SP', _count: 1 }],
        cropsByType: [{ name: 'Soja', _count: 1 }],
      };

      mockHarvestRepository.getDashboardData.mockResolvedValue(
        mockDashboardData,
      );

      const result = await service.getDashboardData();

      expect(result).toBeDefined();
      expect(result).toEqual(mockDashboardData);
      expect(repository.getDashboardData).toHaveBeenCalled();
    });
  });
});
