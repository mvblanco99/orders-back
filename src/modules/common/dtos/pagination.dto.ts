import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    description: 'Número de elementos a mostrar',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit: number;

  @ApiProperty({
    description: 'Número de elementos a saltar',
    required: false,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset: number;
}

export class PaginatedDto {
  @ApiProperty({
    description: 'Número de página',
    required: false,
  })
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber()
  @IsPositive()
  page: number = 1;

  @ApiProperty({
    description: 'Número de elementos a mostrar',
    required: false,
  })
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber()
  @IsPositive()
  pageSize: number = 10;
}

export class PaginationParamsDto {
  @ApiProperty({
    description: 'Número de elementos a saltar',
    required: false,
  })
  @Min(0)
  @Type(() => Number)
  skip?: number = 0;

  @ApiProperty({
    description: 'Número de elementos a mostrar',
    required: false,
  })
  @IsPositive()
  @Type(() => Number)
  take?: number = 10;
}
