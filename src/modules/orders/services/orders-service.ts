import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { CreateOrderDto, QueryOrdersDto } from "../dtos";

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma:PrismaService
    ) {}

    async findAll(filters:QueryOrdersDto, ) {
        const { limit = 10, offset = 0, } = filters;

        const where:any = {}
        
        if(filters.zoneId){
            where.zoneId = filters.zoneId
        }

      
        if (filters.startDate) {
            where.orderDate = { ...where.orderDate, gte: new Date(filters.startDate) };
        }
        if (filters.endDate) {
            where.orderDate = { ...where.orderDate, lte: new Date(filters.endDate) };
        }

        if(filters.isActive){
            where.isActive = filters.isActive
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

    async findOne(id: number) {
        const order = await this.prisma.orders.findFirst({
            where: { id },
            include: {
                Zone: {
                    select: { id: true, name: true },
                },
                User: {
                    select: { id: true, name: true, lastName: true },
                },
                OrderDetails: {
                    include: {
                        Parts: {
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
}