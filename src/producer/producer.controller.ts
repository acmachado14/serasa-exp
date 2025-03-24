import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ProducerResponseDto } from './dto/producer-response.dto';
import { FiltersAndOrdersProducerDto } from './dto/filter-and-orders-producer.dto';

@ApiTags('Producers')
@ApiBearerAuth()
@Controller('producers')
@UseGuards(JwtAuthGuard)
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Producer created successfully.',
    type: ProducerResponseDto,
  })
  async create(
    @Body() createProducerDto: CreateProducerDto,
  ): Promise<ProducerResponseDto> {
    try {
      const result = await this.producerService.create(createProducerDto);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Produtor criado com sucesso',
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

  @ApiResponse({ type: ProducerResponseDto })
  @Get('filter')
  async filter(@Query() query: FiltersAndOrdersProducerDto) {
    try {
      const result = await this.producerService.filterProducer(query);
      return {
        statusCode: HttpStatus.OK,
        message: 'Produtores filtrados com sucesso',
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
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Producer found successfully.',
    type: ProducerResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<ProducerResponseDto> {
    try {
      const result = await this.producerService.findOne(id);

      return {
        statusCode: HttpStatus.OK,
        message: 'Produtor encontrado com sucesso',
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
    description: 'Producer updated successfully.',
    type: ProducerResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateProducerDto: UpdateProducerDto,
  ): Promise<ProducerResponseDto> {
    try {
      const result = await this.producerService.update(id, updateProducerDto);

      return {
        statusCode: HttpStatus.OK,
        message: 'Produtor atualizado com sucesso',
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
    description: 'Producer removed successfully.',
    type: ProducerResponseDto,
  })
  async remove(@Param('id') id: string): Promise<ProducerResponseDto> {
    try {
      const result = await this.producerService.remove(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Produtor removido com sucesso',
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
