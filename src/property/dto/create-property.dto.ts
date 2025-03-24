import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsInt,
  Min,
  IsUUID,
} from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty({
    description: 'Nome da propriedade',
    example: 'Fazenda São João',
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  name: string;

  @ApiProperty({
    description: 'Cidade da propriedade',
    example: 'São Paulo',
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  city: string;

  @ApiProperty({
    description: 'Estado da propriedade',
    example: 'SP',
    minLength: 2,
    maxLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  state: string;

  @ApiProperty({
    description: 'Área total da propriedade em hectares',
    example: 1000,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  totalArea: number;

  @ApiProperty({
    description: 'Área agrícola da propriedade em hectares',
    example: 800,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  agriculturalArea: number;

  @ApiProperty({
    description: 'Área de vegetação da propriedade em hectares',
    example: 200,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  vegetationArea: number;

  @ApiProperty({
    description: 'ID do produtor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  producerId: string;
}
