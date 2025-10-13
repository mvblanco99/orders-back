import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderDetailDto } from './create-order-detail.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID de la zona a la que pertenece la orden.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  zoneId: number;

  @ApiProperty({
    description: 'Total de unidades de la orden',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  totalUnits: number;

  @ApiProperty({
    description: 'Total de partes de la orden',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  totalParts: number;

  @ApiProperty({
    description: 'Número de orden único. Puede ser generado o manual.',
    example: 'ORD-2025-00001',
  })
  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  @ApiProperty({
    description: 'Lista de los detalles/productos de la orden.',
    type: [CreateOrderDetailDto],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  details: CreateOrderDetailDto[];
}