import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

export class FiltersProducerDto {
  @ApiProperty({
    example: '12345678901',
    description: 'CPF do produtor',
    required: false,
  })
  @IsOptional()
  @MaxLength(11)
  cpfCnpj?: string;

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome do produtor',
    required: false,
  })
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    example: '10',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;
}
