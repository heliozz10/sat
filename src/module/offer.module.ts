import { Module } from "@nestjs/common";
import { MenuController } from "../controller/menu.controller";
import { OfferController } from "../controller/offer.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MenuItem } from "../entity/MenuItem";
import { AuthModule } from "./auth.module";
import { MenuService } from "../service/restaurant/menu.service";
import { OfferService } from "../service/restaurant/offer.service";
import { FileService } from "../service/common/file.service";
import { RestaurantService } from "../service/restaurant/restaurant.service";
import { ActiveOffer } from "../entity/ActiveOffer";
import { RestaurantModule } from "./restaurant.module";
import { MeiliSearchClientService } from "../service/common/meilisearch-client.service";
import { SupabaseClientService } from "../service/common/supabase-client.service";
import { FileModule } from "./file.module";
import { AdminPlatformSettingService } from "../service/admin/admin.platform-setting.service";
import { PlatformSettingModule } from "./platform-setting.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([MenuItem, ActiveOffer]),
        RestaurantModule,
        FileModule,
        PlatformSettingModule,
        AuthModule
    ],
    controllers: [MenuController, OfferController],
    providers: [MenuService, OfferService, MeiliSearchClientService],
    exports: [OfferService]
})
export class OfferModule {}