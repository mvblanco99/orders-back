import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import slugify from 'slugify';
import { randomBytes } from 'crypto';

import { compareData, encryptData } from '../../common/utils/encryptData';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ModelUser } from '../interfaces/model-auth.interface';

const DEFAULT_USER_PROFILE_ID = 2;
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,

    private readonly jwtService: JwtService,
  ) {}

  private async _generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = slugify(name, {
      lower: true,     
      strict: true,     
      trim: true,      
    });

    let finalSlug = baseSlug;
    let isSlugTaken = await this.prismaService.user.findUnique({
      where: { slug: finalSlug },
    });

    while (isSlugTaken) {
      const randomSuffix = randomBytes(2).toString('hex');
      finalSlug = `${baseSlug}-${randomSuffix}`;
      
      isSlugTaken = await this.prismaService.user.findUnique({
        where: { slug: finalSlug },
      });
    }

    return finalSlug;
  }

  async create(createUserDto: RegisterUserDto, userId:number) {
    try {
      const { email, password, name, lastName } = createUserDto;

      const existingUser = await this.prismaService.user.findFirst({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        throw new ConflictException(
          `Ya existe un usuario usando este email = "${email}".`,
        );
      }
      
      const uniqueSlug = await this._generateUniqueSlug(name);

      const user = await this.prismaService.$transaction(async (tx) => {

        const user = await tx.user.create({
          data: {
            slug: uniqueSlug, 
            email: createUserDto.email.toLowerCase(),
            password: await encryptData(password),
            name,
            lastName: lastName ?? null,
            profileId: DEFAULT_USER_PROFILE_ID,
          },
          select: {
            id: true,
            email: true,
            name: true,
            lastName: true,
            isActive: true,
          },
        });

        tx.userLogger.create({
          data: {
            userId,
            action:`Usuario con id: ${userId}, registro un nuevo usuario = ${user.email} - ${user.id}`
          }
        })

        return user;
      })

      return { jwt: this.getJsonWebToken({ uid: user.id }) };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocurrió un error inesperado al registrar el usuario.',
      );
    }
  }
  async login(loginUserDto: LoginUserDto) {
    const email = loginUserDto.email.toLowerCase();
    const password = loginUserDto.password;

    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        isActive: true,
        password: true,
      },
    });

    if (!user) throw new UnauthorizedException('Credentials invalid');

    if (!user.password)
      throw new UnauthorizedException(
        'This account can only be accessed through a social provider.',
      );

    const isCorrectPassword = await compareData(password, user.password);

    if (!isCorrectPassword)
      throw new UnauthorizedException('Credentials are not valid');

    delete (user as ModelUser)?.password;

    return { ...user, jwt: this.getJsonWebToken({ uid: user.id }) };
  }

  async checkUserIsAdmin(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
       
        isActive: true,
        password: true,
      },
    });

    if (!user) throw new UnauthorizedException('Credentials invalid');

    if(!user.password) new UnauthorizedException('Credentials invalid')

    if (!compareData(password, user.password || ''))
      throw new UnauthorizedException('Credentials are not valid');

    delete (user as ModelUser)?.password;

    return { isAuthorized: true };
  }

  async checkUser(user: ModelUser) {
    delete user?.password;
    return { ...user, jwt: this.getJsonWebToken({ uid: user.id }) };
  }

  public getJsonWebToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleError(error: any): never {
    if (error.errno === 19) throw new BadRequestException(error.message);

    console.log(error);

    throw new InternalServerErrorException('Something went wrong');
  }

 
}
