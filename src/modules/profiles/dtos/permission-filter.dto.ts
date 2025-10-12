import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { PermissionAction, PermissionType } from '@prisma/client';
import { SubjectsEnum } from '../../casl/interfaces/casl.interface';

export class PermissionFilterDto extends PaginationDto {
  @ApiProperty({
    description: 'Acción del permiso',
    enum: PermissionAction,
    required: false,
  })
  @IsEnum(PermissionAction)
  @IsOptional()
  action?: PermissionAction;

  @ApiProperty({
    description: 'Tipo del permiso Puede ser "can" o "cannot"',
    enum: PermissionType,
    required: false,
  })
  @IsEnum(PermissionType)
  @IsOptional()
  type?: PermissionType;

  @ApiProperty({
    description: 'Sujeto del permiso',
    enum: SubjectsEnum,
    required: false,
  })
  @IsEnum(SubjectsEnum)
  @IsOptional()
  subject?: SubjectsEnum;

  @ApiProperty({
    description: 'Id del perfil al que pertenece el permiso',
    required: false,
  })
  @IsOptional()
  @IsInt()
  profileId: number;

  @ApiProperty({
    description: 'Texto de búsqueda',
    required: false,
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  inputSearch?: string;
}
