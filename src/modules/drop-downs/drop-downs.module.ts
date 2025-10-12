import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DropDownsController } from './drop-downs.controller';
import { DropDownsByIdService, DropDownsService } from './services';

@Module({
  controllers: [DropDownsController],
  providers: [DropDownsService, DropDownsByIdService, PrismaService],
})
export class DropDownsModule {}
