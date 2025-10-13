// src/zones/dtos/update-zone.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateZoneDto } from './create-zone.dto';

export class UpdateZoneDto extends PartialType(CreateZoneDto) {}