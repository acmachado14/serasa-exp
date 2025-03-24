import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateProducerDto {
  @ApiProperty({
    description: 'CPF ou CNPJ do produtor',
    example: '12345678900',
    minLength: 11,
    maxLength: 14,
  })
  @IsString()
  @IsNotEmpty()
  @Length(11, 14)
  cpfCnpj: string;

  @ApiProperty({
    description: 'Nome do produtor',
    example: 'João da Silva',
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  name: string;
}
