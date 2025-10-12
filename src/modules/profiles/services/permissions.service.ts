import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreatePermissionDto,
  PermissionFilterDto,
  UpdatePermissionDto,
} from '../dtos';
import { Prisma } from '@prisma/client';

@Injectable()
export class PermissionsService {
  constructor(private prismaService: PrismaService) {}

  async findAll(permissionFilterDto: PermissionFilterDto) {
    const { limit = 10, offset = 0 } = permissionFilterDto;
    const filters: Prisma.PermissionWhereInput = {};

    if (permissionFilterDto.inputSearch) {
      filters.OR = [
        {
          subject: {
            contains: permissionFilterDto.inputSearch,
          },
        },
      ];
    }

    if (permissionFilterDto.action) {
      filters.action = permissionFilterDto.action;
    }

    if (permissionFilterDto.type) {
      filters.type = permissionFilterDto.type;
    }

    if (permissionFilterDto.subject) {
      filters.subject = permissionFilterDto.subject;
    }

    if (permissionFilterDto.profileId) {
      filters.Profiles = {
        some: {
          id: permissionFilterDto.profileId,
        },
      };
    }

    const data = await this.prismaService.permission.findMany({
      skip: offset,
      take: limit,
      where: filters,
    });

    const total = await this.prismaService.permission.count({ where: filters });

    return {
      data,
      total,
    };
  }

  async findOne(id: number) {
    return await this.prismaService.permission.findUnique({
      where: { id },
      include: {
        Profiles: true,
      },
    });
  }

  async create(createPermissionDto: CreatePermissionDto) {
    return await this.prismaService.permission.create({
      data: createPermissionDto,
    });
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return await this.prismaService.permission.update({
      where: { id },
      data: updatePermissionDto,
    });
  }

  async remove(id: number) {
    return await this.prismaService.permission.delete({
      where: { id },
    });
  }
}
