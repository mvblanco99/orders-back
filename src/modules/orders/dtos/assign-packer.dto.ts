import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class AssignRecheckerDto {
  @ApiProperty({
    description: 'IDs de las partes a asignar.',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  partIds: number[];

  @ApiProperty({
    description: 'ID del packer a asignar a todas las partes.',
    example: 4,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  packerId: number;
}
