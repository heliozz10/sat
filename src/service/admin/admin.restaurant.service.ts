import { Injectable } from "@nestjs/common";
import { SupabaseClientService } from "../common/supabase-client.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "../../entity/Restaurant";
import { In, Repository } from "typeorm";
import { RestaurantView } from "../../view/restaurant.view";
import { AdminRestaurantView } from "../../view/admin/admin.restaurant.view";
import { AdminRestaurantDetailedView } from "../../view/admin/admin.restaurant.detailed-view";
import { UpdateRestaurantStatusDto } from "../../dto/admin/update-restaurant-status.dto";
import { RestaurantStatus } from "../../enum/app.enums";
import { AdminNotificationService } from "./admin.notification.service";

@Injectable()
export class AdminRestaurantService {
    private supabase;

    constructor(
        private readonly supabaseClientService: SupabaseClientService,
        private readonly notificationService: AdminNotificationService,
        @InjectRepository(Restaurant) private readonly restaurantRepository: Repository<Restaurant>
    ) {
        this.supabase = this.supabaseClientService.client;
    }

    async getRestaurants(page: number, perPage: number, statuses?: string[]) {
        const restaurants = (await this.restaurantRepository.find({
            where: (!statuses || statuses.length === 0) ? {} : {
                status: In(statuses)
            },
            skip: (page - 1) * perPage,
            take: perPage
        })).map(restaurant => new AdminRestaurantView(restaurant));

        const { data: userInfo, error } = await this.supabase.rpc("get_user_info", {
            uids: restaurants.map(restaurant => restaurant.ownerId)
        });

        if (error) {
            throw error;
        }

        const userInfoMap = new Map(userInfo.map(user => [user.id, user]));

        const restaurantsWithUserInfo = restaurants.map(restaurant => ({
            ...restaurant,
            userInfo: userInfoMap[restaurant.ownerId] ?? null
        }));

        return restaurantsWithUserInfo;
    }

    async getRestaurant(restaurantId: string) {
        const [restaurant, { data: userInfo, error }] = await Promise.all([
            this.restaurantRepository.findOneBy({ id: restaurantId }),
            this.supabase.rpc("get_user_info", {
                uids: [restaurantId]
            })
        ]);

        if (error) {
            throw error;
        }

        const view = {
            ...new AdminRestaurantDetailedView(restaurant),
            userInfo: userInfo[0] ?? null
        };

        return view;
    }


    async updateRestaurantStatus(restaurantId: string, dto: UpdateRestaurantStatusDto) {
        const statusTranslation = {
            "approved": "одобрен",
            "blocked": "заблокирован",
            "on_moderation": "на модерации",
            "rejected": "отклонен"
        };

        this.notificationService.sendNotification(restaurantId, {
            message: `Статус вашего ресторана теперь - ${statusTranslation[dto.status]}.` + (dto.reason ? ` Причина: ${dto.reason}` : ""),
        });

        return this.restaurantRepository.update({ id: restaurantId }, { 
            status: dto.status as RestaurantStatus,
            lastStatusUpdateReason: dto.reason
        });
    }
}