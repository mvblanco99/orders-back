import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AssignRecheckerDto, CreateFailureDto } from '../dtos';

@Injectable()
export class RecheckerService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrderByNumber(orderNumber: string) {
    const order = await this.prisma.orders.findFirst({
      where: { orderNumber, isDeleted: false },
      include: {
        Zone: { select: { id: true, name: true } },
        User: { select: { id: true, name: true, lastName: true } },
        OrderDetails: {
          where: { isDeleted: false },
          include: {
            Parts: {
              where: { isDeleted: false },
              include: {
                Picker: { select: { id: true, name: true, lastName: true } },
                Packer: { select: { id: true, name: true, lastName: true } },
                Rechecker: { select: { id: true, name: true, lastName: true } },
                Failures: {
                  where: { isDeleted: false },
                  select: { id: true, observation: true, createdAt: true },
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw new NotFoundException(`Orden '${orderNumber}' no encontrada.`);

    return order;
  }

  async bulkAssign(recheckerId: number, dto: AssignRecheckerDto) {
    const { partIds, packerId } = dto;

    const packer = await this.prisma.user.findFirst({
      where: { id: packerId, isActive: true, isDeleted: false },
    });
    if (!packer) throw new NotFoundException(`El packer con ID ${packerId} no existe o no está activo.`);

    const parts = await this.prisma.parts.findMany({
      where: { id: { in: partIds }, isDeleted: false },
    });

    const foundIds = parts.map((p) => p.id);
    const missingIds = partIds.filter((id) => !foundIds.includes(id));
    if (missingIds.length > 0) {
      throw new NotFoundException(`Las siguientes partes no existen o fueron eliminadas: ${missingIds.join(', ')}`);
    }

    const alreadyAssigned = parts.filter(
      (p) => p.recheckerId !== null || p.packerId !== null,
    );

    if (alreadyAssigned.length > 0) {
      throw new ForbiddenException(
        `Las siguientes partes ya tienen rechecker o packer asignado: ${alreadyAssigned.map((p) => p.id).join(', ')}`,
      );
    }

    return this.prisma.$transaction(
      partIds.map((id) =>
        this.prisma.parts.update({
          where: { id },
          data: { recheckerId, packerId },
          select: {
            id: true,
            Rechecker: { select: { id: true, name: true, lastName: true } },
            Packer: { select: { id: true, name: true, lastName: true } },
          },
        }),
      ),
    );
  }

  async createFailure(recheckerId: number, dto: CreateFailureDto) {
    const part = await this.prisma.parts.findFirst({
      where: { id: dto.partId, isDeleted: false },
    });

    if (!part) throw new NotFoundException(`La parte con ID ${dto.partId} no existe o fue eliminada.`);

    if (part.recheckerId !== recheckerId) {
      throw new ForbiddenException('Solo el rechequeador asignado a esta parte puede registrar fallas.');
    }

    return this.prisma.failure.create({
      data: {
        partId: dto.partId,
        observation: dto.observation,
        createdBy: recheckerId,
      },
      select: {
        id: true,
        observation: true,
        createdAt: true,
        Part: {
          select: {
            id: true,
            Picker: { select: { id: true, name: true, lastName: true } },
          },
        },
      },
    });
  }

  async getFailuresByPart(partId: number) {
    const part = await this.prisma.parts.findFirst({
      where: { id: partId, isDeleted: false },
    });

    if (!part) throw new NotFoundException(`La parte con ID ${partId} no existe o fue eliminada.`);

    return this.prisma.failure.findMany({
      where: { partId, isDeleted: false },
      select: {
        id: true,
        observation: true,
        createdAt: true,
        Creator: { select: { id: true, name: true, lastName: true } },
        Part: {
          select: {
            id: true,
            Picker: { select: { id: true, name: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteFailure(failureId: number, userId: number, canManage: boolean) {
    const failure = await this.prisma.failure.findFirst({
      where: { id: failureId, isDeleted: false },
    });

    if (!failure) throw new NotFoundException(`La falla con ID ${failureId} no existe o ya fue eliminada.`);

    if (failure.createdBy !== userId && !canManage) {
      throw new ForbiddenException('Solo el usuario que registró la falla o un administrador puede eliminarla.');
    }

    return this.prisma.failure.update({
      where: { id: failureId },
      data: { isDeleted: true, isActive: false },
      select: { id: true },
    });
  }
}

