import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HarvestService } from './harvest.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { CreateCropDto } from './dto/create-crop.dto';

@ApiTags('Harvests')
@ApiBearerAuth()
@Controller('harvests')
@UseGuards(JwtAuthGuard)
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Safra criada com sucesso.',
  })
  async create(@Body() createHarvestDto: CreateHarvestDto) {
    try {
      const result = await this.harvestService.create(createHarvestDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Safra criada com sucesso',
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

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lista de safras retornada com sucesso.',
  })
  async findAll() {
    try {
      const result = await this.harvestService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Safras encontradas com sucesso',
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
    description: 'Safra encontrada com sucesso.',
  })
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.harvestService.findOne(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Safra encontrada com sucesso',
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
    description: 'Safra removida com sucesso.',
  })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.harvestService.remove(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Safra removida com sucesso',
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

  @Post('crops')
  @ApiResponse({
    status: 201,
    description: 'Cultura adicionada com sucesso.',
  })
  async addCrop(@Body() createCropDto: CreateCropDto) {
    try {
      const result = await this.harvestService.addCrop(createCropDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Cultura adicionada com sucesso',
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

  @Delete('crops/:id')
  @ApiResponse({
    status: 200,
    description: 'Cultura removida com sucesso.',
  })
  async removeCrop(@Param('id') id: string) {
    try {
      const result = await this.harvestService.removeCrop(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Cultura removida com sucesso',
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

  @Get('dashboard/data')
  @ApiResponse({
    status: 200,
    description: 'Dados do dashboard retornados com sucesso.',
  })
  async getDashboardData() {
    try {
      const result = await this.harvestService.getDashboardData();
      return {
        statusCode: HttpStatus.OK,
        message: 'Dados do dashboard retornados com sucesso',
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
