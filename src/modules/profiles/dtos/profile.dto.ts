import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ description: 'Nombre del perfil, debe ser único' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Indica si esta activo o no' })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}

export class PermissionDto {
  @IsInt()
  id: number;
}

export class ManyPermissionDto {
  @ApiProperty({
    description: 'Lista de Ids de permisos a agregar al perfil',
    type: [PermissionDto],
    example: [{ id: 1 }, { id: 2 }, { id: 3 }],
  })
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  items: PermissionDto[];
}
