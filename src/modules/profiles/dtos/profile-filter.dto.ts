import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from '../../common/dtos/pagination.dto';

export class ProfileFilterDto extends PaginationDto {
  @ApiProperty({
    description: 'Texto de búsqueda',
    required: false,
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  inputSearch?: string;
}
