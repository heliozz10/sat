import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientProfile } from "../entity/ClientProfile";
import { FavoriteController } from "../controller/favorite.controller";
import { FavoriteService } from "../service/client/favorite.service";
import { SupabaseClientService } from "../service/common/supabase-client.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([ClientProfile])
    ],
    controllers: [FavoriteController],
    providers: [FavoriteService, SupabaseClientService],
    exports: []
})
export class FavoriteModule {}