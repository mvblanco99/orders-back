import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PermissionAction, PermissionType } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { SubjectsEnum } from '../../casl/interfaces/casl.interface';

export class CreatePermissionDto {
  @ApiProperty({ description: 'Nombre del permiso, debe ser único' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Acción del permiso',
    enum: PermissionAction,
    required: false,
  })
  @IsEnum(PermissionAction)
  action: PermissionAction;

  @ApiProperty({
    description: 'Tipo del permiso Puede ser "can" o "cannot"',
    enum: PermissionType,
    required: false,
  })
  @IsEnum(PermissionType)
  type: PermissionType;

  @ApiProperty({ description: 'Sujeto del permiso' })
  @IsEnum(SubjectsEnum)
  subject: SubjectsEnum;

  @ApiProperty({ description: 'ID del perfil al que pertenece el permiso' })
  @IsInt()
  @IsOptional()
  profileId?: number;
}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
