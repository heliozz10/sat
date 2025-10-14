import { Injectable } from "@nestjs/common";
import { SupabaseClientService } from "../common/supabase-client.service";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientProfile } from "../../entity/ClientProfile";
import { Repository } from "typeorm";
import { RestaurantDetailedView } from "../../view/restaurant.detailed-view";

@Injectable()
export class FavoriteService {
    private supabase;

    constructor(
        private readonly supabaseClientService: SupabaseClientService,
        @InjectRepository(ClientProfile) private clientProfileRepository: Repository<ClientProfile>
    ) {
        this.supabase = this.supabaseClientService.client;
    }

    async getFavorites(userId: string) {
        return (await this.clientProfileRepository.findOneBy({ userId })).favoriteRestaurants.map(restaurant => new RestaurantDetailedView(restaurant));
    }

    addToFavorites(userId: string, restaurantId: string) {
        this.supabase.rpc("add_to_favorites", {
            user_id: userId,
            restaurant_id: restaurantId
        });
    }

    removeFromFavorites(userId: string, restaurantId: string) {
        this.supabase.rpc("remove_from_favorites", {
            user_id: userId,
            restaurant_id: restaurantId
        });
    }
}