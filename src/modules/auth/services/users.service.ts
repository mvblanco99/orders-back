import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { encryptData } from '../../common/utils/encryptData';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from '../dtos';
import { UpdatePasswordDto } from '../dtos/update-password.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.user.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        email: true,
        name: true,
        
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
       
        Profile: {
          include: {
            Permissions: true,
          },
        },
      },
    });

    if (!user) throw new BadRequestException('User not found');

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (id === 1) throw new BadRequestException('Cannot update user');
    if (updateUserDto.password)
      updateUserDto.password = await encryptData(updateUserDto.password);

    if (updateUserDto.email)
      updateUserDto.email = updateUserDto.email.toLowerCase();

    return await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    if (id === 1) throw new BadRequestException('Cannot delete user');
    return await this.prismaService.user.update({
      where: { id },
      data: { isDeleted: true },
    });
  }


  async updatePassword(userId:number, updatePasswordDto:UpdatePasswordDto){
    try {
      const {password} = updatePasswordDto;

      const user = await this.prismaService.user.findFirst({
        where:{id: userId}
      })

      if(!user) throw new BadRequestException('Usuario no esta logueado');

      return await this.prismaService.user.update({
        where:{
          id:userId
        },
        data:{
          password:await encryptData(password)
        }
      })
    } catch (error) {
      this.logger.error(
        `Error al actualizar contraseña para el usuario Id: ${userId}: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      // Para cualquier otro error, lanzamos uno genérico y controlado.
      throw new InternalServerErrorException(
        'Ocurrió un error inesperado al actualizar contraseña.',
      );
    }
  }
}
