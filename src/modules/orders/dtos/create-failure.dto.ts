import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateFailureDto {
  @ApiProperty({
    description: 'ID de la parte a la que se le registra la falla.',
    example: 5,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  partId: number;

  @ApiProperty({
    description: 'Descripción u observación de la falla detectada.',
    example: 'Producto dañado en el empaque.',
  })
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  observation: string;
}
