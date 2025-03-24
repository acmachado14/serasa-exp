import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { GenerateDocuments } from '../src/utils/generate-documents';

describe('HarvestController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let authToken: string;
  let propertyId: string;
  let producerId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    await app.init();
    authToken = jwtService.sign({ sub: '1', email: 'test@example.com' });

    // Limpar dados existentes
    await prisma.crop.deleteMany();
    await prisma.harvest.deleteMany();
    await prisma.property.deleteMany();
    await prisma.producer.deleteMany();

    // Criar um produtor para os testes
    const producer = await prisma.producer.create({
      data: {
        name: 'Test Producer',
        cpfCnpj: GenerateDocuments.generateCPF(),
      },
    });
    producerId = producer.id;

    // Criar uma propriedade para os testes
    const property = await prisma.property.create({
      data: {
        name: 'Test Property',
        city: 'Test City',
        state: 'SP',
        totalArea: 100,
        agriculturalArea: 80,
        vegetationArea: 20,
        producerId: producerId,
      },
    });
    propertyId = property.id;
  });

  afterAll(async () => {
    await prisma.crop.deleteMany();
    await prisma.harvest.deleteMany();
    await prisma.property.deleteMany();
    await prisma.producer.deleteMany();
    await app.close();
  });

  describe('POST /harvests', () => {
    it('should create a harvest', () => {
      return request(app.getHttpServer())
        .post('/harvests')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          year: 2024,
          propertyId: propertyId,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.statusCode).toBe(201);
          expect(res.body.data).toBeDefined();
          expect(res.body.data.year).toBe(2024);
          expect(res.body.data.propertyId).toBe(propertyId);
        });
    });

    it('should return 404 for non-existent property', () => {
      return request(app.getHttpServer())
        .post('/harvests')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          year: 2024,
          propertyId: 'non-existent-id',
        })
        .expect((res) => {
          expect(res.body.statusCode).toBe(404);
          expect(res.body.error).toBe('Propriedade não encontrada');
        });
    });
  });

  describe('GET /harvests', () => {
    it('should return all harvests', () => {
      return request(app.getHttpServer())
        .get('/harvests')
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data).toBeDefined();
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('GET /harvests/:id', () => {
    let harvestId: string;

    beforeAll(async () => {
      const harvest = await prisma.harvest.create({
        data: {
          year: 2024,
          propertyId: propertyId,
        },
      });
      harvestId = harvest.id;
    });

    it('should get a harvest by id', () => {
      return request(app.getHttpServer())
        .get(`/harvests/${harvestId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.data.id).toBe(harvestId);
        });
    });

    it('should return 404 for non-existent harvest', () => {
      return request(app.getHttpServer())
        .get('/harvests/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body.statusCode).toBe(404);
          expect(res.body.error).toBe('Safra não encontrada');
        });
    });
  });

  describe('DELETE /harvests/:id', () => {
    let harvestId: string;

    beforeAll(async () => {
      const harvest = await prisma.harvest.create({
        data: {
          year: 2024,
          propertyId: propertyId,
        },
      });
      harvestId = harvest.id;
    });

    it('should soft delete a harvest', () => {
      return request(app.getHttpServer())
        .delete(`/harvests/${harvestId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.data.deletedAt).toBeDefined();
        });
    });
  });

  describe('POST /harvests/crops', () => {
    let harvestId: string;

    beforeAll(async () => {
      const harvest = await prisma.harvest.create({
        data: {
          year: 2024,
          propertyId: propertyId,
        },
      });
      harvestId = harvest.id;
    });

    it('should add a crop to a harvest', () => {
      return request(app.getHttpServer())
        .post('/harvests/crops')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Soja',
          harvestId: harvestId,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.statusCode).toBe(201);
          expect(res.body.data).toBeDefined();
          expect(res.body.data.name).toBe('Soja');
          expect(res.body.data.harvestId).toBe(harvestId);
        });
    });
  });

  describe('DELETE /harvests/crops/:id', () => {
    let cropId: string;
    let harvestId: string;

    beforeAll(async () => {
      const harvest = await prisma.harvest.create({
        data: {
          year: 2024,
          propertyId: propertyId,
        },
      });
      harvestId = harvest.id;

      const crop = await prisma.crop.create({
        data: {
          name: 'Soja',
          harvestId: harvestId,
        },
      });
      cropId = crop.id;
    });

    it('should remove a crop', () => {
      return request(app.getHttpServer())
        .delete(`/harvests/crops/${cropId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.data.deletedAt).toBeDefined();
        });
    });
  });

  describe('GET /harvests/dashboard/data', () => {
    it('should return dashboard data', () => {
      return request(app.getHttpServer())
        .get('/harvests/dashboard/data')
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.data.totalHarvests).toBeDefined();
          expect(res.body.data.totalCrops).toBeDefined();
          expect(res.body.data.cropsByState).toBeDefined();
          expect(res.body.data.cropsByType).toBeDefined();
        });
    });
  });
});
