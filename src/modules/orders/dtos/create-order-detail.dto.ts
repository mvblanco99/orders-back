import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateOrderDetailDto {
  @ApiProperty({
    description: 'ID de la parte o producto a incluir en la orden.',
    example: 10,
  })
  @IsInt()
  @IsNotEmpty()
  partId: number;

  @ApiProperty({
    description: 'Cantidad de unidades de esta parte.',
    example: 5,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description:
      'ID del usuario "picker" asignado para recoger estas unidades.',
    example: 12,
  })
  @IsInt()
  @IsNotEmpty()
  pickerId: number;
}