import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";
import { ActiveOffer } from "../entity/ActiveOffer";
import { Payment } from "../entity/Payment";
import { Review } from "../entity/Review";
import { OrderController } from "../controller/order.controller";
import { WebhookController } from "../controller/webhook.controller";
import { OrderService } from "../service/client/order.service";
import { SupabaseClientService } from "../service/common/supabase-client.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem, ActiveOffer, Payment, Review])
    ],
    controllers: [OrderController, WebhookController],
    providers: [OrderService, SupabaseClientService],
    exports: []
})
export class OrderModule {}