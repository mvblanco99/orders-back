// src/auth/strategies/discord.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-discord';
import { AuthService } from '../services'; // Importamos AuthService
import { envs } from '../../config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private readonly authService: AuthService, // Inyectamos AuthService
  ) {
    super({
      clientID: envs.discordClientId, // Debes exportar esto desde envs.ts
      clientSecret: envs.discordClientSecret,
      callbackURL: envs.discordCallbackUrl,
      scope: ['identify', 'email'], // Permisos que solicitamos a Discord
    });
  }

  // Este método se ejecuta después de que Discord nos devuelve la información del usuario
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // La responsabilidad de la estrategia es solo validar y pasarle los datos al servicio.
    // Toda la lógica de "buscar o crear usuario" estará en AuthService.
    const user = await this.authService.validateDiscordUser(profile);
    return user; // Lo que retornes aquí será inyectado en `req.user`
  }
}