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

  @Post('register')
  create(@Body() createUserDto: RegisterUserDto) {
    return this.authService.create(createUserDto);
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

  // 1. Ruta de inicio del flujo
  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordLogin() {
    // No se necesita código aquí. El guard redirige automáticamente a Discord.
  }

  // 2. Ruta de callback a la que Discord redirige (CORREGIDA)
  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordCallback(
    @GetUser() user: ModelUser,
    @Res() res: Response, // Inyecta la respuesta en el parámetro 'res'
  ) {
    // La estrategia ya ejecutó validate() y `user` está en `req.user`.
    // Ahora generamos un JWT para este usuario.
    const jwt = this.authService.getJsonWebToken({ uid: user.id });

    // Redirigimos al frontend con el token
    // (puedes pasarlo por query params, o manejarlo de otra forma)
    // Asegúrate de reemplazar esta URL con la real de tu frontend
    res.redirect(`http://localhost:9000/#/auth/callback?token=${jwt}`);
  }

  
}
