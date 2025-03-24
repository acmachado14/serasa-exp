import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderPropertyDto } from './orders-property.dto';
import { FiltersPropertyDto } from './filters-property.dto';

export class FiltersAndOrdersPropertyDto extends FiltersPropertyDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderPropertyDto)
  orders?: OrderPropertyDto;
}
