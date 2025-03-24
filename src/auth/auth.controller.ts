import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AdvancedThrottlerGuard } from './guards/advanced-throttler.guard';

@ApiTags('Autenticação')
@Controller('auth')
@UseGuards(AdvancedThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Realizar login' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 429,
    description: 'Muitas tentativas. Tente novamente mais tarde.',
    type: AuthResponseDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );

      if (!user) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      const result = await this.authService.login(user);

      return {
        statusCode: HttpStatus.OK,
        message: 'Login realizado com sucesso',
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

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 429,
    description: 'Muitas tentativas. Tente novamente mais tarde.',
    type: AuthResponseDto,
  })
  async register(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      const result = await this.authService.register(
        loginDto.email,
        loginDto.password,
      );

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Usuário registrado com sucesso',
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
