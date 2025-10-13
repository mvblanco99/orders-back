import { Module } from "@nestjs/common";
import { OrdersService } from "./services/orders-service";
import { OrdersController } from "./controllers";

@Module({
  controllers:[OrdersController],
  providers: [OrdersService],
  exports: [],
})
export class OrdersModule {}