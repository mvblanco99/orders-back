import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Post,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import {
  CheckPolicies,
  Action,
} from '../../casl/decorators/check-policies.decorator';
import { PoliciesGuard } from '../../casl/guards/policies.guard';
import { ProfilesService } from '../services';
import {
  ProfileFilterDto,
  CreateProfileDto,
  UpdateProfileDto,
  ManyPermissionDto,
} from '../dtos';

@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los perfiles',
    description: `Este método permite obtener todos los perfiles.`,
  })
  @CheckPolicies((ability) => ability.can(Action.Read, 'Profile'))
  async findAll(@Query() profileFilterDto: ProfileFilterDto) {
    return this.profilesService.findAll(profileFilterDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un perfil por ID',
    description: `Este método permite obtener un perfil por ID.`,
  })
  @CheckPolicies((ability) => ability.can(Action.Read, 'Profile'))
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo perfil',
    description: `Este método permite crear un nuevo perfil.`,
  })
  @CheckPolicies((ability) => ability.can(Action.Create, 'Profile'))
  async create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un perfil existente',
    description: `Este método permite actualizar un perfil existente.`,
  })
  @CheckPolicies((ability) => ability.can(Action.Update, 'Profile'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un perfil',
    description: `Este método permite eliminar un perfil.`,
  })
  @CheckPolicies((ability) => ability.can(Action.Delete, 'Profile'))
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.remove(id);
  }

  @Post(':id/permissions')
  @ApiOperation({
    summary: 'Agregar permisos a un perfil',
    description: `Este método permite agregar permisos a un perfil.`,
  })
  @CheckPolicies((ability) => ability.can(Action.Update, 'Profile'))
  async addPermissionToProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() { items }: ManyPermissionDto,
  ) {
    return this.profilesService.addPermissionToProfile(id, items);
  }

  @Patch(':id/permissions')
  @ApiOperation({
    summary: 'Eliminar permisos de un perfil',
    description: `Este método permite eliminar permisos de un perfil.`,
  })
  @CheckPolicies((ability) => ability.can(Action.Update, 'Profile'))
  async removePermissionFromProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() { items }: ManyPermissionDto,
  ) {
    return this.profilesService.removePermissionFromProfile(id, items);
  }
}
