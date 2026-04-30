import { Module } from "@nestjs/common";
import { OrdersService } from "./services/orders-service";
import { RecheckerService } from "./services/rechecker.service";
import { OrdersController, RecheckerController } from "./controllers";

@Module({
  controllers:[OrdersController, RecheckerController],
  providers: [OrdersService, RecheckerService],
  exports: [],
})
export class OrdersModule {}