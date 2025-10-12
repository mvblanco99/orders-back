import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

enum CtMenuTypes {
  SEPARATOR = 'separator',
  LINK = 'link',
  DROPDOWN = 'dropdown',
}

export class CreateMenuItemDto {
  @ApiProperty({ description: 'Identificador único del menú' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Orden de aparición del menú' })
  @IsInt()
  order: number;

  @ApiProperty({ description: 'Tipo de menú', enum: CtMenuTypes })
  @IsEnum(CtMenuTypes)
  type: CtMenuTypes;

  @ApiProperty({ description: 'Descripción del menú' })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({ description: 'Ruta del menú' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({ description: 'Icono del menú' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: 'Indicador de si el menú está activo' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Identificador del menú padre' })
  @IsOptional()
  @IsInt()
  parentId?: number;
}

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {}

export class AddProfilesToMenuItemDto {
  @ApiProperty({ description: 'Lista de identificadores de menus' })
  @IsInt({ each: true })
  menuIds: number[];
}
