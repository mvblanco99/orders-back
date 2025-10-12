
import { join } from 'path';
import { existsSync, createReadStream } from 'fs';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Action, CheckPolicies } from 'src/modules/casl/decorators';
import { PoliciesGuard } from 'src/modules/casl/guards';
import type { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor() {}

  @Get('images/:resourceName/:fileName')
  getImage(
    @Param('resourceName') resourceName: string,
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    // Lógica para servir el archivo
    const filePath = join(
      process.cwd(),
      'uploads',
      'images',
      resourceName,
      fileName,
    );

    if (!existsSync(filePath)) {
      throw new BadRequestException('No se encontro el archivo');
    }

    const fileStream = createReadStream(filePath);
    res.setHeader('Content-Type', 'image/jpeg');
    fileStream.pipe(res);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'User'))
  @Get('excel/:resourceName/:fileName')
  getExcel(
    @Param('resourceName') resourceName: string,
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    // Lógica para servir el archivo
    const filePath = join(
      process.cwd(),
      'uploads',
      'documents',
      resourceName,
      fileName,
    );

    if (!existsSync(filePath)) {
      throw new BadRequestException('No se encontro el archivo');
    }

    const fileStream = createReadStream(filePath);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    fileStream.pipe(res);
  }
}
