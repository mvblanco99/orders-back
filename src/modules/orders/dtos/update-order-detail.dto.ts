import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, ValidateIf } from 'class-validator';

export class UpdateOrderDetailDto {
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

  @ApiPropertyOptional({
    description: 'ID del usuario rechecker asignado. Puede ser null.',
    example: 2,
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_o, v) => v !== null)
  @IsInt()
  recheckerId?: number | null;

  @ApiPropertyOptional({
    description: 'ID del usuario packer asignado. Puede ser null.',
    example: 3,
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_o, v) => v !== null)
  @IsInt()
  packerId?: number | null;
}
