import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateZoneDto, QueryZonesDto, UpdateZoneDto } from '../dtos';

@Injectable()
export class ZonesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createZoneDto: CreateZoneDto) {
    const existingZone = await this.prisma.zones.findUnique({
      where: { name: createZoneDto.name },
    });

    if (existingZone) {
      throw new BadRequestException(
        `Ya existe una zona con el nombre '${createZoneDto.name}'.`,
      );
    }

    return this.prisma.zones.create({
      data: createZoneDto,
    });
  }

  async findAll(filters: QueryZonesDto) {
    const { limit = 10, offset = 0, inputSearch, isActive } = filters;

    const where: any = {
      isDeleted: false, // Siempre excluimos las eliminadas
    };

    if (inputSearch) {
      where.name = { contains: inputSearch, mode: 'insensitive' };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.zones.findMany({
        where,
        take: limit,
        skip: offset,
      }),
      this.prisma.zones.count({ where }),
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
    const zone = await this.prisma.zones.findFirst({
      where: { id, isDeleted: false },
    });

    if (!zone) {
      throw new NotFoundException(`La zona con el ID #${id} no fue encontrada.`);
    }
    return zone;
  }

  async update(id: number, updateZoneDto: UpdateZoneDto) {
    await this.findOne(id); // Reutilizamos para verificar si existe

    if (updateZoneDto.name) {
      const existingZone = await this.prisma.zones.findFirst({
        where: { name: updateZoneDto.name, id: { not: id } },
      });
      if (existingZone) {
        throw new BadRequestException(
          `Ya existe otra zona con el nombre '${updateZoneDto.name}'.`,
        );
      }
    }

    return this.prisma.zones.update({
      where: { id },
      data: updateZoneDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Reutilizamos para verificar si existe

    // Soft delete: actualizamos el campo isDeleted
    await this.prisma.zones.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { message: `La zona con el ID #${id} ha sido eliminada.` };
  }
}