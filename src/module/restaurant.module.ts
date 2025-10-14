import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "../entity/Order";
import { AuthModule } from "./auth.module";
import { RestaurantService } from "../service/restaurant/restaurant.service";
import { RestaurantController } from "../controller/restaurant.controller";
import { Restaurant } from "../entity/Restaurant";
import { SupabaseClientService } from "../service/common/supabase-client.service";
import { GeographyService } from "../service/common/geography.service";
import { RedisClientService } from "../service/common/redis-client.service";
import { FileService } from "../service/common/file.service";
import { MeiliSearchClientService } from "../service/common/meilisearch-client.service";
import { FileModule } from "./file.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Restaurant, Order]),
        FileModule,
        AuthModule
    ],
    controllers: [RestaurantController],
    providers: [RestaurantService, RedisClientService, MeiliSearchClientService, GeographyService],
    exports: [RestaurantService]
})
export class RestaurantModule {}