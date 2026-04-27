import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { encryptData } from '../../common/utils/encryptData';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryUsersDto, RegisterUserDto, UpdateUserDto } from '../dtos';
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private prismaService: PrismaService) {}

  async findAll(filters: QueryUsersDto) {
    const { limit = 10, offset = 0 } = filters;

    const where: any = { isDeleted: false };

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.profileId !== undefined) {
      where.profileId = filters.profileId;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where,
        take: limit,
        skip: offset,
        select: {
          id: true,
          email: true,
          name: true,
          lastName: true,
          slug: true,
          profileId: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { name: 'asc' },
      }),
      this.prismaService.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page: offset / limit + 1,
        totalPages,
      },
    };
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
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

  async create(createDto: RegisterUserDto) {
    let { email, name, lastName, password, profileId } = createDto;

    // Normalizar campos de texto
    email = email.toLowerCase().trim();
    if (name) name = name.trim();
    if (lastName) lastName = lastName.trim();

    // Verificar email duplicado
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (existingUser) throw new BadRequestException('El email ya está registrado');

    // Codificar password
    password = await encryptData(password);

    // Generar slug: primera letra del nombre + apellido, sin acentos ni caracteres especiales
    const normalizeSlug = (str: string) =>
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    const rawSlug = `${name?.charAt(0) ?? ''}${lastName ?? ''}`.toLowerCase();
    const slug = normalizeSlug(rawSlug) || email.split('@')[0];

    try {
      const user = await this.prismaService.user.create({
        data: {
          name: name ?? '',
          lastName: lastName ?? null,
          email,
          Profile: {
            connect: { id: profileId },
          },
          password,
          slug,
        },
        select: {
          id: true,
          email: true,
          name: true,
          lastName: true,
          slug: true,
          profileId: true,
          isActive: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        message: 'Usuario creado exitosamente',
        user,
      };
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new BadRequestException('El slug generado ya existe, verifique nombre y apellido');
      }
      this.logger.error(error);
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (id === 1) throw new BadRequestException('No se puede modificar este usuario');

    // Verificar que el usuario existe
    const currentUser = await this.prismaService.user.findUnique({
      where: { id },
      select: { id: true, name: true, lastName: true, email: true },
    });
    if (!currentUser) throw new NotFoundException('Usuario no encontrado');

    const data: Record<string, unknown> = {};

    // Email: normalizar y verificar duplicado
    if (updateUserDto.email !== undefined) {
      const normalizedEmail = updateUserDto.email.toLowerCase().trim();
      const emailInUse = await this.prismaService.user.findFirst({
        where: { email: normalizedEmail, id: { not: id } },
      });
      if (emailInUse) throw new BadRequestException('El email ya está en uso por otro usuario');
      data.email = normalizedEmail;
    }

    // Password: cifrar solo si se envía
    if (updateUserDto.password !== undefined) {
      data.password = await encryptData(updateUserDto.password);
    }

    // Nombre y/o apellido
    if (updateUserDto.name !== undefined) {
      data.name = updateUserDto.name.trim();
    }

    if (updateUserDto.lastName !== undefined) {
      data.lastName = updateUserDto.lastName.trim() || null;
    }

    // Recalcular slug si cambia nombre o apellido
    if (updateUserDto.name !== undefined || updateUserDto.lastName !== undefined) {
      const normalizeSlug = (str: string) =>
        str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

      const resolvedName = (data.name as string ?? currentUser.name).trim().toLowerCase();
      const resolvedLastName = (data.lastName as string ?? '').trim().toLowerCase();

      data.slug =
        normalizeSlug(`${resolvedName.charAt(0)}${resolvedLastName}`) ||
        (data.email as string ?? currentUser.email).split('@')[0];
    }

    // profileId
    if (updateUserDto.profileId !== undefined) {
      data.profileId = updateUserDto.profileId;
    }

    try {
      const user = await this.prismaService.user.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          name: true,
          lastName: true,
          slug: true,
          profileId: true,
          isActive: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        message: 'Usuario actualizado exitosamente',
        user,
      };
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new BadRequestException('El slug generado ya existe, verifique nombre y apellido');
      }
      this.logger.error(error);
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  async remove(id: number) {
    if (id === 1) throw new BadRequestException('Cannot delete user');
    return await this.prismaService.user.update({
      where: { id },
      data: { isDeleted: true },
    });
  }


  
}
