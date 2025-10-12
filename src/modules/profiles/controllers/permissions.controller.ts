import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import {
  CheckPolicies,
  Action,
} from '../../casl/decorators/check-policies.decorator';
import { PoliciesGuard } from '../../casl/guards/policies.guard';
import { PermissionsService } from '../services';
import {
  CreatePermissionDto,
  PermissionFilterDto,
  UpdatePermissionDto,
} from '../dtos';

@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los permisos',
    description: `Este método permite obtener todos los permisos.`,
  })
  @CheckPolicies((ability) => ability.can(Action.Read, 'Permission'))
  async findAll(@Query() permissionFilterDto: PermissionFilterDto) {
    return this.permissionsService.findAll(permissionFilterDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un permiso por ID',
    description: `Este método permite obtener un permiso por ID.`,
  })
  @CheckPolicies((ability) => ability.can(Action.Read, 'Permission'))
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo permiso',
    description: `Este método permite crear un nuevo permiso.`,
  })
  @CheckPolicies((ability) => ability.can(Action.Create, 'Permission'))
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un permiso existente',
    description: `Este método permite actualizar un permiso existente.`,
  })
  @CheckPolicies((ability) => ability.can(Action.Update, 'Permission'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }
}
