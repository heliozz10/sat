import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlatformSetting } from "../entity/PlatformSetting";
import { RedisClientService } from "../service/common/redis-client.service";
import { AdminPlatformSettingService } from "../service/admin/admin.platform-setting.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([PlatformSetting])
    ],
    controllers: [],
    providers: [AdminPlatformSettingService, RedisClientService],
    exports: [AdminPlatformSettingService, RedisClientService]
})
export class PlatformSettingModule {}