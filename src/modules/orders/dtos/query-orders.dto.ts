import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/modules/common/dtos/pagination.dto";

enum OrderStatus {
    pending = 'pending',
    processing = 'processing',
    completed = 'completed',
    cancelled = 'cancelled',
}

export class QueryOrdersDto extends PaginationDto{
    @ApiPropertyOptional({ description: 'Filter by zoneId', example: 1 })
    @IsOptional()
    @IsNumber()
    zoneId?: number;

    @ApiPropertyOptional({
    description: 'Filtrar por fecha de inicio (formato YYYY-MM-DD).',
    example: '2025-01-01',
    })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({
        description: 'Filtrar por fecha de fin (formato YYYY-MM-DD).',
        example: '2025-01-31',
    })
    @IsOptional()
    @IsDateString()
    endDate?: string

    @ApiPropertyOptional({ description: 'Filter by creatorId order', example: 1 })
    @IsOptional()
    @IsNumber()
    creatorBy?:number

    @ApiPropertyOptional({ description: 'Filter by pickerId order', example: 1 })
    @IsOptional()
    @IsNumber()
    pickerId?:number

    @ApiPropertyOptional({ description: 'Filter by packerId order', example: 1 })
    @IsOptional()
    @IsNumber()
    packerId?:number

    @ApiPropertyOptional({ description: 'Filter by checkerId order', example: 1 })
    @IsOptional()
    @IsNumber()
    recheckerId?:number

    @ApiPropertyOptional({ description: 'Filter by orderNumber', example: 'ORD123456' })
    @IsOptional()
    @IsString()
    orderNumber?:string

    @ApiPropertyOptional({
        description: 'Filtrar por estado del pedido',
        enum: OrderStatus,
        example: 'pending',
    })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus

}