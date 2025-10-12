import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateMenuItemDto,
  UpdateMenuItemDto,
  MenuItemsFilterDto,
} from '../dtos';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenuItemsService {
  constructor(private prismaService: PrismaService) {}

  async create(createBranchDto: CreateMenuItemDto) {
    return await this.prismaService.menuItems.create({
      data: createBranchDto,
    });
  }

  async findAll(filterDto: MenuItemsFilterDto) {
    const filters: Prisma.MenuItemsWhereInput = {};
    const {
      profileId,
      parentId,
      inputSearch,
      limit = 200,
      offset = 0,
    } = filterDto;

    if (profileId) {
      filters.ProfileMenuItems = {
        some: { profileId },
      };
    }
    if (parentId) {
      filters.parentId = parentId;
    }
    if (inputSearch) {
      filters.OR = [
        {
          title: {
            contains: inputSearch,
            mode: 'insensitive',
          },
        },
        {
          icon: {
            contains: inputSearch,
            mode: 'insensitive',
          },
        },
      ];
    }

    const data = await this.prismaService.menuItems.findMany({
      where: filters,
      orderBy: { order: 'asc' },
      take: limit,
      skip: offset,
    });

    const total = await this.prismaService.menuItems.count({
      where: filters,
    });

    return {
      data,
      total,
    };
  }

  async findAllByUserProfile(profileId: number, onlyIds = false) {
    return await this.prismaService.menuItems.findMany({
      where: { ProfileMenuItems: { some: { profileId } }, isActive: true },
      select: onlyIds
        ? { id: true }
        : {
            id: true,
            title: true,
            icon: true,
            order: true,
            parentId: true,
            caption: true,
            isActive: true,
            link: true,
            type: true,
          },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: number) {
    const res = await this.prismaService.menuItems.findUnique({
      where: { id },
    });

    if (!res) throw new BadRequestException('ct_menu_items not found');

    return res;
  }

  async update(id: number, updatect_menu_itemsDto: UpdateMenuItemDto) {
    return await this.prismaService.menuItems.update({
      where: { id },
      data: updatect_menu_itemsDto,
    });
  }

  async updateProfileMenuItems(profileId: number, menuItemsId: number[]) {
    // Remove existing menu items not in the provided menuItemsId
    await this.prismaService.profileMenuItems.deleteMany({
      where: {
        profileId,
        menuItemId: { notIn: menuItemsId },
      },
    });

    // Upsert the provided menu items
    for (const menuItemId of menuItemsId) {
      await this.prismaService.profileMenuItems.upsert({
        where: {
          profileId_menuItemId: { menuItemId, profileId },
        },
        create: { menuItemId, profileId },
        update: { menuItemId, profileId },
      });
    }

    return {
      message: 'Profiles updated for menu items successfully',
      data: menuItemsId,
    };
  }

  async remove(id: number) {
    return await this.prismaService.menuItems.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
