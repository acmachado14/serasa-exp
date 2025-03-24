import { IsOptional, ValidateNested } from 'class-validator';
import { FiltersProducerDto } from './filters-producer.dto';
import { OrderProducerDto } from './orders-producer.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FiltersAndOrdersProducerDto extends FiltersProducerDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderProducerDto)
  orders?: OrderProducerDto;
}
