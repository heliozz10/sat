import { Injectable, NotFoundException, UseInterceptors } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "../../entity/Restaurant";
import { Repository } from "typeorm";
import { Order } from "../../entity/Order";
import { UpdateRestaurantDto } from "../../dto/restaurant/update-restaurant.dto";
import { GeographyService } from "../common/geography.service";
import { FileService } from "../common/file.service";
import { RedisClientService } from "../common/redis-client.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { OrderVerificationCode } from "../../dto/auth/order-verification-code.dto";
import { SupabaseClientService } from "../common/supabase-client.service";
import { MeiliSearchClientService } from "../common/meilisearch-client.service";
import { MeiliSearch, Meilisearch } from "meilisearch";
import { RestaurantView } from "../../view/restaurant.view";

@Injectable()
export class RestaurantService {
    public static readonly MEILISEARCH_INDEX_NAME = "approved-restaurant-views";

    private supabase;
    private redis;
    private meiliSearch: MeiliSearch;

    constructor(
        private readonly supabaseClientService: SupabaseClientService,
        private readonly redisClientService: RedisClientService,
        private readonly meiliSearchClientService: MeiliSearchClientService,
        private readonly geographyService: GeographyService,
        private readonly fileService: FileService,
        @InjectRepository(Restaurant) private readonly restaurantRepository: Repository<Restaurant>,
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>
    ) {
        this.supabase = this.supabaseClientService.client;
        this.redis = this.redisClientService.client;
        this.meiliSearch = this.meiliSearchClientService.client;

        this.meiliSearch.getIndex(RestaurantService.MEILISEARCH_INDEX_NAME).catch(() => {
            this.meiliSearch.createIndex(RestaurantService.MEILISEARCH_INDEX_NAME, {
                primaryKey: "id"
            });
        }).then(() => {
            this.meiliSearch.index(RestaurantService.MEILISEARCH_INDEX_NAME).updateSettings({
                searchableAttributes: ["name", "address"],
                filterableAttributes: ["id"],
                typoTolerance: {
                    enabled: true,
                    minWordSizeForTypos: {
                        oneTypo: 3,
                        twoTypos: 7
                    }
                }
            })
        });
    }

    async getRestaurant(userId: string) {
        return this.getRestaurantByUserId(userId);
    }

    async updateRestaurant(userId: string, dto: UpdateRestaurantDto, newPhoto?: Express.Multer.File) {
        const restaurant = await this.getRestaurant(userId);

        Object.assign(restaurant, dto);

        if(dto.location) {
            restaurant.location = {
                type: "Point",
                coordinates: [dto.location.longitude, dto.location.latitude]
            }
            restaurant.address = await this.geographyService.getAddressFromCoordinates(dto.location.latitude, dto.location.longitude);
        }

        if (newPhoto) {
            await this.uploadPhoto(userId, restaurant, newPhoto);
        }

        restaurant.status = "on_moderation";

        this.redis.del(this.getRestaurantRedisKey(userId));

        restaurant.updatedAt = new Date();
        return this.restaurantRepository.save(restaurant);
    }

    async getSalesHistory(userId: string) {
        return this.orderRepository.find({
            where: {
                restaurant: {
                    ownerId: userId
                }
            },
            select: ["totalRestaurantPayout", "createdAt"]
        });
    }

    async verifyOrderCode(userId: string, dto: OrderVerificationCode) {
        const { data, error } = await this.supabase.rpc('verify_order_code', {
            verification_code: dto.code
        });

        if (error) {
            throw error;
        }

        return data;
    }

    private async uploadPhoto(userId: string, restaurant: Restaurant, newPhoto: Express.Multer.File) {
        const fileExtension = newPhoto.originalname.split('.').pop();
        const filePath = `restaurants/${userId}/${new Date()}.${fileExtension}`;

        await this.fileService.uploadFile(newPhoto, 'restaurant-photos', filePath);

        const url = await this.fileService.getPublicUrl('restaurant-photos', filePath);

        restaurant.photoUrl = url;
    }

    async getRestaurantByUserId(userId: string): Promise<Restaurant> {
        const key = this.getRestaurantRedisKey(userId);

        const restaurant = await this.redisClientService.cacheOrFetch(key, 60 * 60, async () => {
            const restaurant = await this.restaurantRepository.findOneBy({ ownerId: userId });
            if (!restaurant) {
                throw new NotFoundException();
            }
            return restaurant;
        })

        return restaurant;
    }

    private getRestaurantRedisKey(userId: string) {
        return `restaurant:by-user-id:${userId}`;
    }

    private async indexRestaurant(restaurantView: RestaurantView) {
        await this.meiliSearch.index(RestaurantService.MEILISEARCH_INDEX_NAME).addDocuments([restaurantView]);
    }
}