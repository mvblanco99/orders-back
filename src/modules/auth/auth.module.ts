import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthService, UsersService } from './services';
import { AuthController, UsersController } from './controllers';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { envs } from '../config';

@Global()
@Module({
  controllers: [AuthController, UsersController],
  providers: [AuthService, UsersService, JwtStrategy, PrismaService],
  imports: [
    ConfigModule,

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        return {
          secret: envs.jwtSecret,
          signOptions: { expiresIn: '12h' },
        };
      },
    }),
  ],
  exports: [PassportModule, JwtModule, JwtStrategy, AuthService],
})
export class AuthModule {}
