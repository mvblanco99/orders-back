import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { AddOrderDetailDto, CreateOrderDetailDto, CreateOrderDto, QueryOrdersDto, UpdateOrderDetailDto, UpdateOrderHeaderDto } from '../dtos';
import { PoliciesGuard } from 'src/modules/casl/guards';
import { GetUser } from 'src/modules/auth/decorators';
import type { AppAbility, UserLogged } from 'src/modules/casl/interfaces';
import { Action, CheckPolicies } from 'src/modules/casl/decorators';

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
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'Delivery'))
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
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Delivery'))
  findAll(@Query() queryOrdersDto: QueryOrdersDto) {
    return this.ordersService.findAll(queryOrdersDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por su ID' })
  @ApiResponse({ status: 200, description: 'Orden encontrada.' })
  @ApiResponse({ status: 404, description: 'La orden con el ID especificado no fue encontrada.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Delivery'))
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('viewAll') viewAll?: string,
  ) {
    return this.ordersService.findOne(id, viewAll === 'true');
  }

  @Post(':orderNumber/details')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Agregar un nuevo detalle/parte a una orden existente' })
  @ApiResponse({ status: 201, description: 'Detalle agregado correctamente.' })
  @ApiResponse({ status: 400, description: 'La cantidad excede el total del pedido.' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'Delivery'))
  addDetail(
    @Param('orderNumber') orderNumber: string,
    @Body() dto: AddOrderDetailDto,
  ) {
    return this.ordersService.addOrderDetail(orderNumber, dto);
  }

  @Patch(':id/header')
  @ApiOperation({ summary: 'Actualizar la cabecera de una orden (número, zona, total de unidades)' })
  @ApiResponse({ status: 200, description: 'Cabecera actualizada correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o conflicto de número de orden.' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'Delivery'))
  updateHeader(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderHeaderDto,
  ) {
    return this.ordersService.updateOrderHeader(id, dto);
  }

  @Patch('details/:id')
  @ApiOperation({ summary: 'Actualizar el detalle de una orden (cantidad, picker, rechecker, packer)' })
  @ApiResponse({ status: 200, description: 'Detalle actualizado correctamente.' })
  @ApiResponse({ status: 400, description: 'La cantidad excede el total del pedido.' })
  @ApiResponse({ status: 404, description: 'Detalle de orden no encontrado.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'Delivery'))
  updateDetail(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDetailDto,
  ) {
    return this.ordersService.updateOrderDetail(id, dto);
  }

  @Delete('details/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deshabilitar un detalle de la orden y su parte asociada (soft delete)' })
  @ApiResponse({ status: 204, description: 'Detalle y parte deshabilitados correctamente.' })
  @ApiResponse({ status: 404, description: 'Detalle de orden no encontrado.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, 'Delivery'))
  removeDetail(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.removeOrderDetail(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar (soft delete) un pedido completo con sus detalles y partes' })
  @ApiResponse({ status: 204, description: 'Pedido eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, 'Delivery'))
  removeOrder(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.removeOrder(id);
  }
}