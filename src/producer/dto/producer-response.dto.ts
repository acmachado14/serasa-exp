import { ApiProperty } from '@nestjs/swagger';
import { Producer } from '@prisma/client';

export class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  lastPage: number;
}

export class ProducerResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Operação realizada com sucesso' })
  message: string;

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      cpf_cnpj: '12345678900',
      name: 'João da Silva',
      properties: [],
      created_at: '2024-03-23T00:00:00.000Z',
      updated_at: '2024-03-23T00:00:00.000Z',
    },
  })
  data?:
    | (Producer & {
        properties?: any[];
      })
    | (Producer & {
        properties?: any[];
      })[];

  @ApiProperty({ type: PaginationMetaDto })
  meta?: PaginationMetaDto;

  @ApiProperty({ example: null })
  error?: string | null;
}
