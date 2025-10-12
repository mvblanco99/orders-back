import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { QueryOrdersDto } from "../dtos";

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma:PrismaService
    ) {}

    async findAll(filters:QueryOrdersDto) {
        const { limit = 10, offset = 0, } = filters;

        const where:any = {}
        
        if(filters.zondeId){
            where.zoneId = filters.zondeId
        }

        if (filters.startDate) {
            where.orderDate = { lte: new Date(filters.startDate) } ;
        }

        if (filters.endDate) {
           where.orderDate = { gte: new Date(filters.endDate) } ;
        }

        if(filters.isActive){
            where.isActive = filters.isActive
        }

        if(filters.creatorBy){
            where.creatorBy = filters.creatorBy
        }

        if(filters.pickerId){
            where.pickerId = filters.pickerId
        }

        if(filters.packerId){
            where.packerId = filters.packerId
        }

        if(filters.recheckerId){
            where.recheckerId = filters.recheckerId
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

    async createOrder(){}
}