import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateHarvestDto {
  @ApiProperty({
    description: 'Ano da safra',
    example: 2024,
    minimum: 1900,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1900)
  year: number;

  @ApiProperty({
    description: 'ID da propriedade',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  propertyId: string;
}
