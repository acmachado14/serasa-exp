import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { GenerateDocuments } from '../src/utils/generate-documents';

describe('PropertyController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let authToken: string;
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
  });

  afterAll(async () => {
    await prisma.crop.deleteMany();
    await prisma.harvest.deleteMany();
    await prisma.property.deleteMany();
    await prisma.producer.deleteMany();
    await app.close();
  });

  describe('POST /properties', () => {
    it('should create a property', () => {
      return request(app.getHttpServer())
        .post('/properties')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Property',
          city: 'Test City',
          state: 'SP',
          totalArea: 100,
          agriculturalArea: 80,
          vegetationArea: 20,
          producerId: producerId,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.statusCode).toBe(201);
          expect(res.body.data).toBeDefined();
          expect(res.body.data.name).toBe('Test Property');
          expect(res.body.data.city).toBe('Test City');
          expect(res.body.data.state).toBe('SP');
          expect(res.body.data.totalArea).toBe(100);
          expect(res.body.data.agriculturalArea).toBe(80);
          expect(res.body.data.vegetationArea).toBe(20);
          expect(res.body.data.producerId).toBe(producerId);
        });
    });

    it('should return 400 for invalid area constraints', () => {
      return request(app.getHttpServer())
        .post('/properties')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Property',
          city: 'Test City',
          state: 'SP',
          totalArea: 100,
          agriculturalArea: 90,
          vegetationArea: 20,
          producerId: producerId,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.error).toBe(
            'A soma das áreas agrícola e de vegetação não pode ser maior que a área total',
          );
        });
    });
  });

  describe('GET /properties/filter', () => {
    it('should filter properties', () => {
      return request(app.getHttpServer())
        .get('/properties/filter?filters={"page":1,"limit":10}')
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data).toBeDefined();
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should filter properties by state', () => {
      return request(app.getHttpServer())
        .get('/properties/filter?filters={"state":"SP","page":1,"limit":10}')
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data).toBeDefined();
          expect(Array.isArray(res.body.data)).toBe(true);
          res.body.data.forEach((property: any) => {
            expect(property.state).toBe('SP');
          });
        });
    });
  });

  describe('GET /properties/:id', () => {
    let propertyId: string;

    beforeAll(async () => {
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

    it('should get a property by id', () => {
      return request(app.getHttpServer())
        .get(`/properties/${propertyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.data.id).toBe(propertyId);
        });
    });

    it('should return 404 for non-existent property', () => {
      return request(app.getHttpServer())
        .get('/properties/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body.statusCode).toBe(404);
          expect(res.body.error).toBe('Propriedade não encontrada');
        });
    });
  });

  describe('PUT /properties/:id', () => {
    let propertyId: string;

    beforeAll(async () => {
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

    it('should update a property', () => {
      return request(app.getHttpServer())
        .put(`/properties/${propertyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Property',
          city: 'Updated City',
        })
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.data.name).toBe('Updated Property');
          expect(res.body.data.city).toBe('Updated City');
        });
    });

    it('should return 400 for invalid area constraints on update', () => {
      return request(app.getHttpServer())
        .put(`/properties/${propertyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          agriculturalArea: 90,
          vegetationArea: 20,
        })
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.error).toBe(
            'A soma das áreas agrícola e de vegetação não pode ser maior que a área total',
          );
        });
    });
  });

  describe('DELETE /properties/:id', () => {
    let propertyId: string;

    beforeAll(async () => {
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

    it('should soft delete a property', () => {
      return request(app.getHttpServer())
        .delete(`/properties/${propertyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.data.deletedAt).toBeDefined();
        });
    });
  });
});
