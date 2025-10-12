import { Module } from '@nestjs/common';
import { PermissionsController, ProfilesController } from './controllers';
import { PermissionsService, ProfilesService } from './services';

@Module({
  controllers: [ProfilesController, PermissionsController],
  providers: [PermissionsService, ProfilesService],
})
export class ProfilesModule {}
