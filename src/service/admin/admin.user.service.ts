import { Injectable, NotFoundException } from "@nestjs/common";
import { SupabaseClientService } from "../common/supabase-client.service";
import { ProfileType, UserStatus } from "../../enum/app.enums";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientProfile } from "../../entity/ClientProfile";
import { Not, Repository } from "typeorm";
import { Restaurant } from "../../entity/Restaurant";
import { AdminUserDetailedView } from "../../view/admin/admin.user.detailed-view";
import { AdminClientProfileView } from "../../view/admin/admin.client-profile.view";
import { AdminRestaurantView } from "../../view/admin/admin.restaurant.view";
import { AdminNotificationService } from "./admin.notification.service";

@Injectable()
export class AdminUserService {
    private supabase;

    constructor(
        private readonly supabaseClientService: SupabaseClientService,
        private readonly adminNotificationService: AdminNotificationService,
        @InjectRepository(ClientProfile) private clientProfileRepository: Repository<ClientProfile>,
        @InjectRepository(Restaurant) private restaurantRepository: Repository<Restaurant>
    ) {
        this.supabase = this.supabaseClientService.client;
    }

    async getUsers(page: number, perPage: number, status?: UserStatus, profileType?: ProfileType) {
        const { data, error } = await this.supabase.rpc('get_users', { 
            page: page, 
            per_page: perPage, 
            status: status, 
            profile_type: profileType 
        });

        if(error) {
            throw error;
        }

        return data;
    }

    async getUser(userId: string) {
        const { data, error } = await this.supabase.rpc('get_user_by_id', { uid: userId });

        if(error) {
            throw error;
        }

        if(data.length === 0) {
            throw new NotFoundException("User not found");
        }

        let profile: AdminClientProfileView | AdminRestaurantView;

        if(data[0].profile_type === "client") {
            profile = new AdminClientProfileView(await this.clientProfileRepository.findOneBy({ id: userId }));
        } else if (data[0].profile_type === "restaurant") {
            profile = new AdminRestaurantView(await this.restaurantRepository.findOneBy({ id: userId }));
        }

        return {
            ...data[0],
            profileType: data[0].profile_type,
            profile: profile
        };
    }

    async updateUserStatus(userId: string, status: UserStatus) {
        const { data, error } = await this.supabase.rpc('update_user_status', { uid: userId, new_status: status });

        if(error) {
            throw error;
        }

        switch(status) {
            case "active":
                this.adminNotificationService.sendNotification(userId, {
                    message: "Ваш аккаунт был разблокирован",
                });
                break;
            case "blocked":
                this.adminNotificationService.sendNotification(userId, {
                    message: "Ваш аккаунт был заблокирован",
                });
                break;
            default:
                break;
        }

        return data;
    }
}