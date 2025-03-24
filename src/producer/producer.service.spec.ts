import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from './producer.service';
import { ProducerRepository } from './producer.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProducerDto } from './dto/create-producer.dto';

describe('ProducerService', () => {
  let service: ProducerService;
  let repository: ProducerRepository;

  const mockProducerRepository = {
    create: jest.fn(),
    filterProducer: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        {
          provide: ProducerRepository,
          useValue: mockProducerRepository,
        },
      ],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
    repository = module.get<ProducerRepository>(ProducerRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a producer with valid CPF/CNPJ', async () => {
      const createProducerDto: CreateProducerDto = {
        name: 'Test Producer',
        cpfCnpj: '94130127098',
      };

      mockProducerRepository.create.mockResolvedValue({
        id: '1',
        ...createProducerDto,
      });

      const result = await service.create(createProducerDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(createProducerDto.name);
      expect(result.cpfCnpj).toBe(createProducerDto.cpfCnpj);
      expect(repository.create).toHaveBeenCalledWith(createProducerDto);
    });

    it('should throw BadRequestException for invalid CPF/CNPJ', async () => {
      const createProducerDto: CreateProducerDto = {
        name: 'Test Producer',
        cpfCnpj: '123',
      };

      await expect(service.create(createProducerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a producer when found', async () => {
      const producer = {
        id: '1',
        name: 'Test Producer',
        cpfCnpj: '12345678901',
      };

      mockProducerRepository.findById.mockResolvedValue(producer);

      const result = await service.findOne('1');

      expect(result).toBeDefined();
      expect(result).toEqual(producer);
    });

    it('should throw NotFoundException when producer not found', async () => {
      mockProducerRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a producer with valid data', async () => {
      const updateData = {
        name: 'Updated Name',
        cpfCnpj: '94130127098',
      };

      mockProducerRepository.findById.mockResolvedValue({
        id: '1',
        name: 'Test Producer',
        cpfCnpj: '94130127098',
      });

      mockProducerRepository.update.mockResolvedValue({
        id: '1',
        ...updateData,
      });

      const result = await service.update('1', updateData);

      expect(result).toBeDefined();
      expect(result.name).toBe(updateData.name);
      expect(result.cpfCnpj).toBe(updateData.cpfCnpj);
    });

    it('should throw BadRequestException for invalid CPF/CNPJ', async () => {
      const updateData = {
        cpfCnpj: '123',
      };

      mockProducerRepository.findById.mockResolvedValue({
        id: '1',
        name: 'Test Producer',
        cpfCnpj: '12345678901',
      });

      await expect(service.update('1', updateData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a producer', async () => {
      mockProducerRepository.findById.mockResolvedValue({
        id: '1',
        name: 'Test Producer',
        cpfCnpj: '12345678901',
      });

      mockProducerRepository.softDelete.mockResolvedValue({
        id: '1',
        deletedAt: new Date(),
      });

      const result = await service.remove('1');

      expect(result).toBeDefined();
      expect(result.deletedAt).toBeDefined();
      expect(repository.softDelete).toHaveBeenCalledWith('1');
    });
  });
});
