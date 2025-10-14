import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlatformSetting } from "../../entity/PlatformSetting";
import { RedisClientService } from "../common/redis-client.service";

@Injectable()
export class AdminPlatformSettingService {
    private redis;

    constructor(
        private readonly redisClientService: RedisClientService,
        @InjectRepository(PlatformSetting) private readonly platformSettingRepository: Repository<PlatformSetting>
    ) {
        this.redis = this.redisClientService.client;
    }

    async getPlatformSettings() {
        return this.platformSettingRepository.find();
    }

    async getPlatformSetting(key: string) {
        const platformSetting = await this.redisClientService.cacheOrFetch(this.getPlatformSettingRedisKey(key), 60 * 60, async () => {
            const freshPlatformSetting = await this.platformSettingRepository.findOneBy({ key });
            if (!freshPlatformSetting) {
                throw new NotFoundException();
            }
            return freshPlatformSetting;
        })
        return platformSetting;
    }

    async setPlatformSetting(key: string, value: string) {
        await this.platformSettingRepository.save({key, value});
        await this.redis.del(this.getPlatformSettingRedisKey(key));
    }

    async deletePlatformSetting(key: string) {
        await this.platformSettingRepository.delete({key});
        await this.redis.del(this.getPlatformSettingRedisKey(key));
    }

    private getPlatformSettingRedisKey(key: string) {
        return `platform-setting:${key}`;
    }
}