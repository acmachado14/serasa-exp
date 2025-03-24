import { ApiProperty } from '@nestjs/swagger';

export class PropertyResponseDto {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem de resposta',
    example: 'Operação realizada com sucesso',
  })
  message: string;

  @ApiProperty({
    description: 'Dados da propriedade',
    required: false,
  })
  data?: any;

  @ApiProperty({
    description: 'Metadados da resposta (para paginação)',
    required: false,
  })
  meta?: any;

  @ApiProperty({
    description: 'Mensagem de erro, se houver',
    required: false,
  })
  error?: string;
} 