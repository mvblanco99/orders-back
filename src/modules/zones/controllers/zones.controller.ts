import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ZonesService } from '../services';
import { CreateZoneDto, QueryZonesDto, UpdateZoneDto } from '../dtos';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Zones')
@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva zona' })
  @ApiResponse({ status: 201, description: 'Zona creada exitosamente.' })
  create(@Body() createZoneDto: CreateZoneDto) {
    return this.zonesService.create(createZoneDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de zonas' })
  findAll(@Query() queryZonesDto: QueryZonesDto) {
    return this.zonesService.findAll(queryZonesDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una zona por su ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.zonesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una zona existente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateZoneDto: UpdateZoneDto,
  ) {
    return this.zonesService.update(id, updateZoneDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar una zona (Soft Delete)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.zonesService.remove(id);
  }
}