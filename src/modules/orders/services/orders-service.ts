import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { AddOrderDetailDto, CreateOrderDetailDto, CreateOrderDto, QueryOrdersDto, UpdateOrderDetailDto, UpdateOrderHeaderDto } from "../dtos";

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma:PrismaService
    ) {}

    async findAll(filters:QueryOrdersDto, ) {
        const { limit = 10, offset = 0, } = filters;

        const where:any = { isDeleted: filters.status === 'cancelled' }
        
        if(filters.zoneId){
            where.zoneId = filters.zoneId
        }

        if (filters.startDate) {
            where.orderDate = { ...where.orderDate, gte: new Date(filters.startDate) };
        }
        if (filters.endDate) {
            where.orderDate = { ...where.orderDate, lte: new Date(filters.endDate) };
        }

        if(filters.creatorBy){
            where.creatorBy = filters.creatorBy
        }

        if(filters.pickerId){
            where.OrderDetails = { some: { Parts: { some: { pickerId: filters.pickerId } } } }
        }

        if(filters.packerId){
            where.OrderDetails = { some: { Parts: { some: { packerId: filters.packerId } } } }
        }

        if(filters.recheckerId){
            where.OrderDetails = { some: { Parts: { some: { recheckerId: filters.recheckerId } } } }
        }

        if(filters.orderNumber){
            where.orderNumber = {
                contains: filters.orderNumber,
                mode: 'insensitive'
            }
        }

        if(filters.status){
            where.status = filters.status
        }

        const [data, total] = await this.prisma.$transaction([
            this.prisma.orders.findMany({
                where,
                take: limit,
                skip: offset,
                include: {
                    Zone: {
                        select: { name: true },
                    },
                },
            }),
            this.prisma.orders.count({ where })
        ])

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            meta: {
                total: total,
                page: offset / limit + 1,
                totalPages,
            },
        };
    }

    async findOne(id: number, viewAll = false) {
        const deletedFilter = viewAll ? undefined : false;
        const order = await this.prisma.orders.findFirst({
            where: { id, ...(deletedFilter !== undefined && { isDeleted: deletedFilter }) },
            include: {
                Zone: {
                    select: { id: true, name: true },
                },
                User: {
                    select: { id: true, name: true, lastName: true },
                },
                OrderDetails: {
                    where: deletedFilter !== undefined ? { isDeleted: deletedFilter } : {},
                    include: {
                        Parts: {
                            where: deletedFilter !== undefined ? { isDeleted: deletedFilter } : {},
                            include: {
                                Picker: { select: { id: true, name: true, lastName: true } },
                                Packer: { select: { id: true, name: true, lastName: true } },
                                Rechecker: { select: { id: true, name: true, lastName: true } },
                            },
                        },
                    },
                },
            },
        });

        if (!order) throw new NotFoundException('Order not found');

        return order;
    }

    async createOrder(createOrderDto: CreateOrderDto, createdById: number) {
        const { zoneId, orderNumber, totalParts,totalUnits,details } = createOrderDto;

        // Validar que el orderNumber no exista
        const existingOrder = await this.prisma.orders.findUnique({
            where: { orderNumber },
        });

        if (existingOrder) {
            throw new BadRequestException(`La orden con el número ${orderNumber} ya existe.`);
        }

        return this.prisma.$transaction(async (tx) => {
            // 1. Crear la cabecera de la Orden (Orders)
            const order = await tx.orders.create({
                data: {
                    orderNumber,
                    zoneId,
                    createdBy: createdById,
                    totalUnits,
                    totalParts,
                    orderDate:new Date(),
                    status: 'pending', 
                },
            });

            // 2. Crear los detalles de la orden (OrdersDetails) y las partes (Parts)
            for (const detail of details) {
                const { partId, quantity, pickerId } = detail;

                const orderDetail = await tx.ordersDetails.create({
                    data: {
                        orderId: order.id,
                        partId,
                        quantity,
                    },
                });

                // 3. Crear UN único registro en `Parts` por cada detalle de la orden
                await tx.parts.create({
                    data: {
                        orderDetailId: orderDetail.id,
                        pickerId,
                        // packerId y recheckerId se asignarán en etapas posteriores
                    },
                });
            }

            // 3. Si algún detalle tiene picker asignado, pasar el pedido a "processing"
            const hasAnyPicker = details.some(d => d.pickerId != null);
            if (hasAnyPicker) {
                await tx.orders.update({
                    where: { id: order.id },
                    data: { status: 'processing' },
                });
            }

            // Devolver la orden completa con sus detalles
            return tx.orders.findUnique({
                where: { id: order.id },
                include: {
                    OrderDetails: {
                        include: {
                            Parts: true,
                        },
                    },
                },
            });
        });
    }

    async updateOrderHeader(orderId: number, dto: UpdateOrderHeaderDto) {
        const order = await this.prisma.orders.findFirst({
            where: { id: orderId, isActive: true, isDeleted: false },
        });

        if (!order) throw new NotFoundException('Orden no encontrada');

        if (dto.orderNumber !== order.orderNumber) {
            const existing = await this.prisma.orders.findUnique({
                where: { orderNumber: dto.orderNumber },
            });
            if (existing) {
                throw new BadRequestException(`El número de orden ${dto.orderNumber} ya existe`);
            }
        }

        // Validar que el nuevo totalUnits no sea menor que la suma actual de unidades asignadas
        const sumResult = await this.prisma.ordersDetails.aggregate({
            where: { orderId, isActive: true },
            _sum: { quantity: true },
        });
        const assignedUnits = sumResult._sum.quantity ?? 0;

        if (dto.totalUnits < assignedUnits) {
            throw new BadRequestException(
                `El total de unidades (${dto.totalUnits}) no puede ser menor que las unidades ya asignadas en los detalles (${assignedUnits})`,
            );
        }

        return this.prisma.orders.update({
            where: { id: orderId },
            data: {
                orderNumber: dto.orderNumber,
                zoneId: dto.zoneId,
                totalUnits: dto.totalUnits,
            },
        });
    }

    async updateOrderDetail(orderDetailId: number, dto: UpdateOrderDetailDto) {
        const { quantity, pickerId, recheckerId = null, packerId = null } = dto;

        const orderDetail = await this.prisma.ordersDetails.findFirst({
            where: { id: orderDetailId, isActive: true, isDeleted: false },
            include: { Order: true },
        });

        if (!orderDetail) throw new NotFoundException('Detalle de orden no encontrado');

        // Suma de unidades de los demás detalles activos del mismo pedido
        const otherSumResult = await this.prisma.ordersDetails.aggregate({
            where: {
                orderId: orderDetail.orderId,
                isActive: true,
                id: { not: orderDetailId },
            },
            _sum: { quantity: true },
        });
        const otherSum = otherSumResult._sum.quantity ?? 0;

        const available = orderDetail.Order.totalUnits - otherSum;
        if (quantity > available) {
            throw new BadRequestException(
                `La cantidad excede el total del pedido. Máximo disponible para esta parte: ${available}`,
            );
        }

        return this.prisma.$transaction(async (tx) => {
            await tx.ordersDetails.update({
                where: { id: orderDetailId },
                data: { quantity },
            });

            await tx.parts.updateMany({
                where: { orderDetailId, isActive: true },
                data: { pickerId, recheckerId, packerId },
            });

            return tx.ordersDetails.findUnique({
                where: { id: orderDetailId },
                include: {
                    Parts: {
                        include: {
                            Picker: { select: { id: true, name: true, lastName: true } },
                            Packer: { select: { id: true, name: true, lastName: true } },
                            Rechecker: { select: { id: true, name: true, lastName: true } },
                        },
                    },
                },
            });
        });
    }

    async addOrderDetail(orderNumber: string, dto: AddOrderDetailDto) {
        const { quantity, pickerId } = dto;

        const order = await this.prisma.orders.findFirst({
            where: { orderNumber, isActive: true, isDeleted: false },
        });

        if (!order) throw new NotFoundException('Orden no encontrada');

        const sumResult = await this.prisma.ordersDetails.aggregate({
            where: { orderId: order.id, isActive: true },
            _sum: { quantity: true },
        });
        const assignedUnits = sumResult._sum.quantity ?? 0;
        const available = order.totalUnits - assignedUnits;

        if (quantity > available) {
            throw new BadRequestException(
                `La cantidad excede el total del pedido. Unidades disponibles: ${available}`,
            );
        }

        // Calcular el siguiente partId: MAX de todos los detalles del pedido
        // (incluidos los eliminados) para mantener la secuencia sin reutilizar números
        const maxPartResult = await this.prisma.ordersDetails.aggregate({
            where: { orderId: order.id },
            _max: { partId: true },
        });
        const nextPartId = (maxPartResult._max.partId ?? 0) + 1;

        return this.prisma.$transaction(async (tx) => {
            const orderDetail = await tx.ordersDetails.create({
                data: { orderId: order.id, partId: nextPartId, quantity },
            });

            await tx.parts.create({
                data: { orderDetailId: orderDetail.id, pickerId },
            });

            return tx.ordersDetails.findUnique({
                where: { id: orderDetail.id },
                include: {
                    Parts: {
                        include: {
                            Picker: { select: { id: true, name: true, lastName: true } },
                        },
                    },
                },
            });
        });
    }

    async removeOrder(orderId: number) {
        const order = await this.prisma.orders.findFirst({
            where: { id: orderId, isActive: true, isDeleted: false },
        });

        if (!order) throw new NotFoundException('Orden no encontrada o ya está eliminada');

        await this.prisma.$transaction(async (tx) => {
            // Deshabilitar la orden
            await tx.orders.update({
                where: { id: orderId },
                data: { isActive: false, isDeleted: true, status: 'cancelled' },
            });

            // Obtener los IDs de todos los detalles del pedido
            const details = await tx.ordersDetails.findMany({
                where: { orderId },
                select: { id: true },
            });
            const detailIds = details.map(d => d.id);

            // Deshabilitar todos los detalles
            await tx.ordersDetails.updateMany({
                where: { orderId },
                data: { isActive: false, isDeleted: true },
            });

            // Deshabilitar todas las partes asociadas
            await tx.parts.updateMany({
                where: { orderDetailId: { in: detailIds } },
                data: { isActive: false, isDeleted: true },
            });
        });
    }

    async removeOrderDetail(orderDetailId: number) {
        const orderDetail = await this.prisma.ordersDetails.findFirst({
            where: { id: orderDetailId, isActive: true },
        });

        if (!orderDetail) {
            throw new NotFoundException('Detalle de orden no encontrado o ya está deshabilitado');
        }

        await this.prisma.$transaction(async (tx) => {
            await tx.ordersDetails.update({
                where: { id: orderDetailId },
                data: { isActive: false, isDeleted:true },
            });

            await tx.parts.updateMany({
                where: { orderDetailId },
                data: { isActive: false, isDeleted:true },
            });
        });
    }
}