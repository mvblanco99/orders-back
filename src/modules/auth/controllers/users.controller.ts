import {
  Controller,
  Body,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

import { PoliciesGuard } from '../../casl/guards/policies.guard';
import {
  Action,
  CheckPolicies,
} from '../../casl/decorators/check-policies.decorator';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dtos';

import { GetUser } from '../decorators';
import type { ModelUser } from '../interfaces/model-auth.interface';
import { UpdatePasswordDto } from '../dtos/update-password.dto';

@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, 'User'))
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  getProfile(@GetUser() user: ModelUser) {
    return this.usersService.findOne(user.id);
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.Read, 'User'))
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.Update, 'User'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.Delete, 'User'))
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Patch()
  @CheckPolicies((ability) => ability.can(Action.Delete, 'User'))
  updatePassword(@GetUser() user: ModelUser, @Body() updatePassword:UpdatePasswordDto) {
    return this.usersService.updatePassword(user.id, updatePassword);
  }

}
