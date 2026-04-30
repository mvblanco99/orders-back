import {
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PoliciesGuard } from 'src/modules/casl/guards';
import { GetUser } from 'src/modules/auth/decorators';
import type { AppAbility, UserLogged } from 'src/modules/casl/interfaces';
import { Action, CheckPolicies } from 'src/modules/casl/decorators';
import { CaslAbilityFactory } from 'src/modules/casl/casl/casl-ability.factory';
import { RecheckerService } from '../services';
import { AssignRecheckerDto, CreateFailureDto } from '../dtos';

@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
@ApiTags('Rechecker')
@Controller('rechecker')
export class RecheckerController {
  constructor(
    private readonly recheckerService: RecheckerService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get('orders/:orderNumber')
  @ApiOperation({ summary: 'Buscar una orden por su número de pedido' })
  @ApiResponse({ status: 200, description: 'Orden encontrada con sus partes vigentes.' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Rechecker'))
  findOrder(@Param('orderNumber') orderNumber: string) {
    return this.recheckerService.findOrderByNumber(orderNumber);
  }

  @Patch('parts/assign')
  @ApiOperation({ summary: 'Asignarse como rechequeador y asignar un packer a múltiples partes' })
  @ApiResponse({ status: 200, description: 'Partes asignadas correctamente.' })
  @ApiResponse({ status: 403, description: 'Alguna parte ya tiene un rechequeador asignado.' })
  @ApiResponse({ status: 404, description: 'Alguna parte o el packer no fueron encontrados.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'Rechecker'))
  bulkAssign(
    @Body() dto: AssignRecheckerDto,
    @GetUser() user: UserLogged,
  ) {
    return this.recheckerService.bulkAssign(user.id, dto);
  }

  @Post('failures')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar una falla en una parte del pedido' })
  @ApiResponse({ status: 201, description: 'Falla registrada correctamente.' })
  @ApiResponse({ status: 403, description: 'Solo el rechequeador asignado puede registrar fallas.' })
  @ApiResponse({ status: 404, description: 'Parte no encontrada.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'Rechecker'))
  createFailure(
    @Body() dto: CreateFailureDto,
    @GetUser() user: UserLogged,
  ) {
    return this.recheckerService.createFailure(user.id, dto);
  }

  @Get('parts/:partId/failures')
  @ApiOperation({ summary: 'Obtener todas las fallas de una parte' })
  @ApiResponse({ status: 200, description: 'Lista de fallas de la parte.' })
  @ApiResponse({ status: 404, description: 'Parte no encontrada.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Rechecker'))
  getFailures(@Param('partId', ParseIntPipe) partId: number) {
    return this.recheckerService.getFailuresByPart(partId);
  }

  @Delete('failures/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una falla (solo el creador o un usuario con permiso manage)' })
  @ApiResponse({ status: 204, description: 'Falla eliminada correctamente.' })
  @ApiResponse({ status: 403, description: 'No autorizado para eliminar esta falla.' })
  @ApiResponse({ status: 404, description: 'Falla no encontrada.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, 'Rechecker') || ability.can(Action.Manage, 'Rechecker'))
  deleteFailure(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserLogged,
  ) {
    const ability = this.caslAbilityFactory.createForUser(user);
    const canManage = ability.can(Action.Manage, 'Rechecker');
    return this.recheckerService.deleteFailure(id, user.id, canManage);
  }
}
