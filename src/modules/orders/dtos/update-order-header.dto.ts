import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class UpdateOrderHeaderDto {
  @ApiProperty({
    description: 'Número de la orden.',
    example: 'ORD-2025-00001',
  })
  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  @ApiProperty({
    description: 'ID de la zona a la que pertenece la orden.',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  zoneId: number;

  @ApiProperty({
    description: 'Total de unidades de la orden.',
    example: 100,
  })
  @IsInt()
  @IsPositive()
  totalUnits: number;
}
