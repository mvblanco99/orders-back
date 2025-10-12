import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MenuItemsFilterDto extends PaginationDto {
  @ApiProperty({
    description: 'Identificador del perfil al que pertenece el menú',
    required: false,
    type: 'number',
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  profileId?: number;

  @ApiProperty({
    description: 'Identificador del menú padre al que pertenece el menú',
    required: false,
    type: 'number',
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  parentId?: number;

  @ApiProperty({
    description: 'Búsqueda por texto [title o icon]',
    required: false,
  })
  @IsString()
  @IsOptional()
  inputSearch?: string;
}
