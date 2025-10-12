import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { envs } from '../../config';
import { ModelUser } from '../interfaces/model-auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envs.jwtSecret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<ModelUser> {
    const { uid } = payload;

    const user = await this.prismaService.user.findUnique({
      where: { id: uid },
      include: { Profile: { include: { Permissions: true } } },
    });

    if (!user) throw new UnauthorizedException('Credentials invalid');

    if (!user.isActive) throw new UnauthorizedException('User is not active');

    if (user.isDeleted) throw new UnauthorizedException('User not found');

    return user;
  }
}
