import { Controller, Post, Body, Get, UseGuards, Res,} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express'; // Usa "import type" para la anotación

import {
  Action,
  CheckPolicies,
} from '../../casl/decorators/check-policies.decorator';
import { GetUser, RawHeaders, Auth } from '../decorators';
import { AuthService } from '../services';
import { RegisterUserDto, LoginUserDto } from '../dtos';
import { PoliciesGuard } from '../../casl/guards/policies.guard';
import type { ModelUser } from '../interfaces/model-auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth('JWT')
  @Post('register')
  create(@Body() createUserDto: RegisterUserDto, @GetUser() user: ModelUser) {
    return this.authService.create(createUserDto, user.id);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiBearerAuth('JWT')
  @Auth()
  @Get('check-auth-token')
  checkAuthToken(@GetUser() user: ModelUser) {
    return this.authService.checkUser(user);
  }

  @Post('check-user-is-admin')
  checkUserIsAdmin(@Body() loginUserDto: LoginUserDto) {
    return this.authService.checkUserIsAdmin(loginUserDto);
  }

  @ApiBearerAuth('JWT')
  @Auth()
  @Get('me')
  private(
    @GetUser() user: ModelUser,
    @GetUser('email') email: string,
    @RawHeaders() rawHeaders: string[],
  ) {
    return { user, email, headers: rawHeaders };
  }
  
}
