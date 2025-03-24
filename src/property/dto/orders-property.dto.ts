import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderPropertyDto {
  @ApiProperty({
    example: 'asc',
    description: 'Ordem do nome',
    required: false,
  })
  @IsOptional()
  name?: 'asc' | 'desc';

  @ApiProperty({
    example: 'asc',
    description: 'Ordem da cidade',
    required: false,
  })
  @IsOptional()
  city?: 'asc' | 'desc';

  @ApiProperty({
    example: 'asc',
    description: 'Ordem do estado',
    required: false,
  })
  @IsOptional()
  state?: 'asc' | 'desc';

  @ApiProperty({
    example: 'asc',
    description: 'Ordem da data de criação',
    required: false,
  })
  @IsOptional()
  createdAt?: 'asc' | 'desc';
}
