import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

export class FiltersPropertyDto {
  @ApiProperty({
    example: 'Fazenda São João',
    description: 'Nome da propriedade',
    required: false,
  })
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    example: 'São Paulo',
    description: 'Cidade da propriedade',
    required: false,
  })
  @IsOptional()
  @MaxLength(255)
  city?: string;

  @ApiProperty({
    example: 'SP',
    description: 'Estado da propriedade',
    required: false,
  })
  @IsOptional()
  @MaxLength(2)
  state?: string;

  @ApiProperty({
    example: 10,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;
}
