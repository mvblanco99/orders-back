import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { PoliciesGuard } from '../../casl/guards/policies.guard';
import { CheckPolicies, Action } from '../../casl/decorators';
import {
  CreateMenuItemDto,
  UpdateMenuItemDto,
  AddProfilesToMenuItemDto as ProfilesToMenuItemDto,
  MenuItemsFilterDto,
} from '../dtos';
import { MenuItemsService } from '../services';
import { GetUser } from 'src/modules/auth/decorators';

@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.Create, 'MenuItems'))
  create(@Body() createBranchDto: CreateMenuItemDto) {
    return this.menuItemsService.create(createBranchDto);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, 'MenuItems'))
  findAll(@Query() filters: MenuItemsFilterDto) {
    return this.menuItemsService.findAll(filters);
  }

  @Get('by-user-profile')
  @CheckPolicies((ability) => ability.can(Action.Read, 'MenuItems'))
  findAllByUserProfileLogged(@GetUser('profileId') profileId: number) {
    return this.menuItemsService.findAllByUserProfile(profileId);
  }

  @Get('by-user-profile/:profileId')
  @CheckPolicies((ability) => ability.can(Action.Read, 'MenuItems'))
  findAllByUserProfile(
    @Param('profileId') profileId: number,
    @Query('onlyIds') onlyIds: boolean,
  ) {
    return this.menuItemsService.findAllByUserProfile(profileId, onlyIds);
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.Read, 'MenuItems'))
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemsService.findOne(id);
  }

  @Patch('add-profiles/:profileId')
  @CheckPolicies((ability) => ability.can(Action.Create, 'MenuItems'))
  addProfilesToMenuItem(
    @Param('profileId', ParseIntPipe) profileId: number,
    @Body() menus: ProfilesToMenuItemDto,
  ) {
    return this.menuItemsService.updateProfileMenuItems(
      profileId,
      menus.menuIds,
    );
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.Update, 'MenuItems'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBranchDto: UpdateMenuItemDto,
  ) {
    return this.menuItemsService.update(id, updateBranchDto);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.Delete, 'MenuItems'))
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemsService.remove(id);
  }
}
