// src/zones/zones.module.ts
import { Module } from '@nestjs/common';
import { ZonesService } from './services';
import { ZonesController } from './controllers';

@Module({
  controllers: [ZonesController],
  providers: [ZonesService],
})
export class ZonesModule {}