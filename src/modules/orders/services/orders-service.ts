import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
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
        const order = this.prisma.orders.findFirst({
            where: { id },
            include:{
                OrderDetails:{
                    include:{
                        Parts:true
                    }
                }
            }
        })

        if(!order) throw new NotFoundException('Order not found') 

        return order
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
                        partId, // Este ID debe corresponder a una entidad "Producto" o "Parte"
                        quantity,
                    },
                });

                // 3. Crear un registro en `Parts` por cada unidad en `quantity`
                const partsToCreate: Prisma.PartsCreateManyInput[] = [];
                for (let i = 0; i < quantity; i++) {
                    partsToCreate.push({
                        orderDetailId: orderDetail.id,
                        pickerId,
                        // packerId y recheckerId se asignarán en etapas posteriores
                    });
                }
                
                await tx.parts.createMany({
                    data: partsToCreate,
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