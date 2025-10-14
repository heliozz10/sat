import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Restaurant } from "../entity/Restaurant";
import { UserNotification } from "../entity/UserNotification";
import { PlatformSetting } from "../entity/PlatformSetting";
import { AdminAnalyticsController } from "../controller/admin/admin.analytics.controller";
import { AdminClientController } from "../controller/admin/admin.client.controller";
import { AdminPlatformSettingController } from "../controller/admin/admin.platform-setting.controller";
import { AdminRestaurantController } from "../controller/admin/admin.restaurant.controller";
import { AdminReviewController } from "../controller/admin/admin.review.controller";
import { AdminUserController } from "../controller/admin/admin.user.controller";
import { SupabaseClientService } from "../service/common/supabase-client.service";
import { ClientProfile } from "../entity/ClientProfile";
import { Review } from "../entity/Review";
import { AdminAnalyticsService } from "../service/admin/admin.analytics.service";
import { AdminClientService } from "../service/admin/admin.client.service";
import { AdminPlatformSettingService } from "../service/admin/admin.platform-setting.service";
import { AdminRestaurantService } from "../service/admin/admin.restaurant.service";
import { AdminReviewService } from "../service/admin/admin.review.service";
import { AdminUserService } from "../service/admin/admin.user.service";
import { AdminFinanceService } from "../service/admin/admin.finance.service";
import { AdminNotificationService } from "../service/admin/admin.notification.service";
import { AuthModule } from "./auth.module";
import { PlatformSettingModule } from "./platform-setting.module";
import { MeiliSearchClientService } from "../service/common/meilisearch-client.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([ClientProfile, Restaurant, UserNotification, Review, PlatformSetting]),
        PlatformSettingModule,
        AuthModule
    ],
    controllers: [
        AdminAnalyticsController,
        AdminClientController,
        AdminPlatformSettingController,
        AdminRestaurantController,
        AdminReviewController,
        AdminUserController
    ],
    providers: [
        SupabaseClientService,
        MeiliSearchClientService,
        AdminAnalyticsService,
        AdminClientService,
        AdminFinanceService,
        AdminNotificationService,
        AdminRestaurantService,
        AdminReviewService,
        AdminUserService
    ],
    exports: []
})
export class AdminModule {}