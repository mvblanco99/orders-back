import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProfileFilterDto, CreateProfileDto, UpdateProfileDto } from '../dtos';
import { Prisma } from '@prisma/client';
import { PermissionDto } from '../dtos/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prismaService: PrismaService) {}

  async findAll(profileFilterDto: ProfileFilterDto) {
    const { limit = 10, offset = 0 } = profileFilterDto;
    const filters: Prisma.ProfileWhereInput = { isDeleted: false };

    if (profileFilterDto.inputSearch) {
      filters.OR = [
        {
          name: {
            contains: profileFilterDto.inputSearch,
          },
        },
      ];
    }

    const data = await this.prismaService.profile.findMany({
      include: {
        _count: {
          select: {
            Users: true,
            Permissions: true,
          },
        },
      },
      skip: offset,
      take: limit,
      where: filters,
    });

    const total = await this.prismaService.profile.count({ where: filters });

    return {
      data,
      total,
    };
  }

  async findOne(id: number) {
    return await this.prismaService.profile.findUnique({
      where: { id },
      include: {
        Permissions: true,
        _count: {
          select: {
            Users: true,
            Permissions: true,
          },
        },
      },
    });
  }

  async create(createProfileDto: CreateProfileDto) {
    return await this.prismaService.profile.create({
      data: createProfileDto,
    });
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    return await this.prismaService.profile.update({
      where: { id },
      data: updateProfileDto,
    });
  }

  async addPermissionToProfile(
    profileId: number,
    permissions: PermissionDto[],
  ) {
    return await this.prismaService.profile.update({
      where: { id: profileId },
      data: {
        Permissions: {
          connect: permissions,
        },
      },
    });
  }

  async removePermissionFromProfile(
    profileId: number,
    permissions: PermissionDto[],
  ) {
    return await this.prismaService.profile.update({
      where: { id: profileId },
      data: {
        Permissions: {
          disconnect: permissions,
        },
      },
    });
  }

  async remove(id: number) {
    if (id === 1)
      throw new BadRequestException('Cannot delete the default profile');

    return await this.prismaService.profile.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
