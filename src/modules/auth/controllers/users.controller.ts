import {
  Controller,
  Body,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
  Post,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

import { PoliciesGuard } from '../../casl/guards/policies.guard';
import {
  Action,
  CheckPolicies,
} from '../../casl/decorators/check-policies.decorator';
import { UsersService } from '../services/users.service';
import { QueryUsersDto, RegisterUserDto, UpdateUserDto } from '../dtos';

import { GetUser } from '../decorators';
import type { ModelUser } from '../interfaces/model-auth.interface';

@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, 'User'))
  findAll(@Query() filters: QueryUsersDto) {
    return this.usersService.findAll(filters);
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

  @Post()
  @CheckPolicies((ability) => ability.can(Action.Create, 'User'))
  create(
    @Body() registerUserDto: RegisterUserDto,
  ) {
    return this.usersService.create(registerUserDto);
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

}
