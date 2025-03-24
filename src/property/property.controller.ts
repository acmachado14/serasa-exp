import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyResponseDto } from './dto/property-response.dto';
import { FiltersAndOrdersPropertyDto } from './dto/filter-and-orders-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@ApiTags('Properties')
@ApiBearerAuth()
@Controller('properties')
@UseGuards(JwtAuthGuard)
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Propriedade criada com sucesso.',
    type: PropertyResponseDto,
  })
  async create(@Body() createPropertyDto: CreatePropertyDto) {
    try {
      const result = await this.propertyService.create(createPropertyDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Propriedade criada com sucesso',
        data: result,
        error: null,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Erro interno do servidor',
        data: undefined,
        error: error.message,
      };
    }
  }

  @Get('filter')
  @ApiResponse({ type: PropertyResponseDto })
  async filter(@Query() query: FiltersAndOrdersPropertyDto) {
    try {
      const result = await this.propertyService.filterProperty(query);
      return {
        statusCode: HttpStatus.OK,
        message: 'Propriedades filtradas com sucesso',
        data: result.data,
        meta: result.meta,
        error: null,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Erro interno do servidor',
        data: undefined,
        error: error.message,
      };
    }
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Propriedade encontrada com sucesso.',
    type: PropertyResponseDto,
  })
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.propertyService.findOne(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Propriedade encontrada com sucesso',
        data: result,
        error: null,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Erro interno do servidor',
        data: undefined,
        error: error.message,
      };
    }
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Propriedade atualizada com sucesso.',
    type: PropertyResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    try {
      const result = await this.propertyService.update(id, updatePropertyDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Propriedade atualizada com sucesso',
        data: result,
        error: null,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Erro interno do servidor',
        data: undefined,
        error: error.message,
      };
    }
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Propriedade removida com sucesso.',
    type: PropertyResponseDto,
  })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.propertyService.remove(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Propriedade removida com sucesso',
        data: result,
        error: null,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Erro interno do servidor',
        data: undefined,
        error: error.message,
      };
    }
  }
}
