import { Module } from '@nestjs/common';
import { MenuItemsController } from './controllers';
import { MenuItemsService } from './services';

@Module({
  controllers: [MenuItemsController],
  providers: [MenuItemsService],
})
export class MenuItemsModule {}
