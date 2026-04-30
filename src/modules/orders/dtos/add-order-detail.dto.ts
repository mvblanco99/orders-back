import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class AddOrderDetailDto {
  @ApiProperty({
    description: 'Cantidad de unidades de esta parte. Mínimo 1.',
    example: 10,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'ID del usuario picker asignado a esta parte.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  pickerId: number;
}
