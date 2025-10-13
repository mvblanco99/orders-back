// src/zones/dtos/create-zone.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateZoneDto {
  @ApiProperty({ description: 'Nombre único de la zona', example: 'Zona Norte' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Indica si la zona está activa. Por defecto es true.',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}