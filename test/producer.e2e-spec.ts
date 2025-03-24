import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { GenerateDocuments } from '../src/utils/generate-documents';

describe('ProducerController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    await app.init();
    authToken = jwtService.sign({ sub: '1', email: 'test@example.com' });

    await prisma.crop.deleteMany();
    await prisma.harvest.deleteMany();
    await prisma.property.deleteMany();
    await prisma.producer.deleteMany();
  });

  afterAll(async () => {
    await prisma.crop.deleteMany();
    await prisma.harvest.deleteMany();
    await prisma.property.deleteMany();
    await prisma.producer.deleteMany();
    await app.close();
  });

  describe('POST /producers', () => {
    it('should create a producer', () => {
      const cpf = GenerateDocuments.generateCPF();
      return request(app.getHttpServer())
        .post('/producers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Producer',
          cpfCnpj: cpf,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(res.body.data.name).toBe('Test Producer');
          expect(res.body.data.cpfCnpj).toBe(cpf);
        });
    });

    it('should return 400 for invalid CPF/CNPJ', () => {
      return request(app.getHttpServer())
        .post('/producers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Producer',
          cpfCnpj: '123',
        })
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.error).toBe('CPF/CNPJ inválido');
        });
    });
  });

  describe('GET /producers/filter', () => {
    it('should filter producers', () => {
      return request(app.getHttpServer())
        .get('/producers/filter?filters={"page":1,"limit":10}')
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data).toBeDefined();
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('GET /producers/:id', () => {
    let producerId: string;

    beforeAll(async () => {
      const producer = await prisma.producer.create({
        data: {
          name: 'Test Producer',
          cpfCnpj: GenerateDocuments.generateCPF(),
        },
      });
      producerId = producer.id;
    });

    it('should get a producer by id', () => {
      return request(app.getHttpServer())
        .get(`/producers/${producerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.data.id).toBe(producerId);
        });
    });

    it('should return 404 for non-existent producer', () => {
      return request(app.getHttpServer())
        .get('/producers/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body.statusCode).toBe(404);
          expect(res.body.error).toBe('Produtor não encontrado');
        });
    });
  });

  describe('PUT /producers/:id', () => {
    let producerId: string;

    beforeAll(async () => {
      const producer = await prisma.producer.create({
        data: {
          name: 'Test Producer',
          cpfCnpj: GenerateDocuments.generateCPF(),
        },
      });
      producerId = producer.id;
    });

    it('should update a producer', () => {
      const newCpf = GenerateDocuments.generateCPF();
      return request(app.getHttpServer())
        .put(`/producers/${producerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Producer',
          cpfCnpj: newCpf,
        })
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.data.name).toBe('Updated Producer');
          expect(res.body.data.cpfCnpj).toBe(newCpf);
        });
    });

    it('should return 400 for invalid CPF/CNPJ on update', () => {
      return request(app.getHttpServer())
        .put(`/producers/${producerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cpfCnpj: '123',
        })
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.error).toBe('CPF/CNPJ inválido');
        });
    });
  });

  describe('DELETE /producers/:id', () => {
    let producerId: string;

    beforeAll(async () => {
      const producer = await prisma.producer.create({
        data: {
          name: 'Test Producer',
          cpfCnpj: GenerateDocuments.generateCPF(),
        },
      });
      producerId = producer.id;
    });

    it('should soft delete a producer', () => {
      return request(app.getHttpServer())
        .delete(`/producers/${producerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.data.deletedAt).toBeDefined();
        });
    });
  });
});
