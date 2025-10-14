import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Restaurant } from "../entity/Restaurant";
import { ActiveOffer } from "../entity/ActiveOffer";
import { CatalogController } from "../controller/catalog.controller";
import { CatalogService } from "../service/common/catalog.service";
import { SupabaseClientService } from "../service/common/supabase-client.service";
import { RedisClientService } from "../service/common/redis-client.service";
import { MeiliSearchClientService } from "../service/common/meilisearch-client.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Restaurant, ActiveOffer])
    ],
    controllers: [CatalogController],
    providers: [CatalogService, SupabaseClientService, RedisClientService, MeiliSearchClientService],
    exports: []
})
export class CatalogModule {}