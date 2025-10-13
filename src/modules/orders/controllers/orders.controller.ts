import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from '../services';
import { CreateOrderDto, QueryOrdersDto } from '../dtos';
import { PoliciesGuard } from 'src/modules/casl/guards';
import { GetUser } from 'src/modules/auth/decorators';
import type { UserLogged } from 'src/modules/casl/interfaces';

@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiResponse({
    status: 201,
    description: 'La orden ha sido creada exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: UserLogged 
  ) {
    return this.ordersService.createOrder(createOrderDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener una lista de órdenes con filtros y paginación' })
  @ApiResponse({ status: 200, description: 'Lista de órdenes obtenida.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  findAll(@Query() queryOrdersDto: QueryOrdersDto) {
    return this.ordersService.findAll(queryOrdersDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por su ID' })
  @ApiResponse({ status: 200, description: 'Orden encontrada.' })
  @ApiResponse({ status: 404, description: 'La orden con el ID especificado no fue encontrada.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }
}