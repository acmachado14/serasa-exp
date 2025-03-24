import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class OrderPropertyDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name?: 'asc' | 'desc';

  @ApiProperty({ required: false })
  @IsOptional()
  city?: 'asc' | 'desc';

  @ApiProperty({ required: false })
  @IsOptional()
  state?: 'asc' | 'desc';

  @ApiProperty({ required: false })
  @IsOptional()
  createdAt?: 'asc' | 'desc';
}
