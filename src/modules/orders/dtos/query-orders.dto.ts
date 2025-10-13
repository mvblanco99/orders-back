import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/modules/common/dtos/pagination.dto";

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
    
    @ApiPropertyOptional({
    description: 'Indica si la oferta está activo',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined; // Si no se envía, se considera como no filtrado
  })
  isActive?: boolean;

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

}