import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { SupabaseClientService } from "./common/supabase-client.service";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientProfile } from "../entity/ClientProfile";
import { getMetadataArgsStorage, Repository } from "typeorm";
import { Restaurant } from "../entity/Restaurant";
import { AppDataSource } from "../data-source";

@Injectable()
export class DummyService implements OnModuleInit, OnModuleDestroy {
    private supabase;
    private _clientUser;
    private _restaurantUser;
    private _clientProfile;
    private _restaurant;
    private _dataSource;

    constructor(
        private readonly supabaseClientService: SupabaseClientService,
        @InjectRepository(ClientProfile) private clientProfileRepository: Repository<ClientProfile>,
        @InjectRepository(Restaurant) private restaurantRepository: Repository<Restaurant>
    ) {
        this.supabase = this.supabaseClientService.client;
        this._dataSource = AppDataSource;
    }

    async onModuleInit() {
        // if (!this._dataSource.isInitialized) {
        //     await this._dataSource.initialize();
        // }
        const { data: dataClientUser, error: errorClientUser } = await this.supabase.auth.admin.createUser({
            phone: "+77077777777",
            phone_confirm: true,
            password: "password",
            user_metadata: {
                profile_type: "client"
            }
        });

        if(errorClientUser) {
            throw errorClientUser;
        }        

        this._clientUser = dataClientUser.user;
        
        const { data: dataRestaurantUser, error: errorRestaurantUser } = await this.supabase.auth.admin.createUser({
            phone: "+77078888888",
            phone_confirm: true,
            password: "password",
            user_metadata: {
                profile_type: "restaurant"
            }
        });

        if(errorRestaurantUser) {
            throw errorRestaurantUser;
        }

        this._restaurantUser = dataRestaurantUser.user;

        this._clientProfile = this.clientProfileRepository.create({
            userId: dataClientUser.user.id,
            name: "Test Client",
            address: "Test Address",
            location: {
                type: "Point",
                coordinates: [0, 0]
            },
            createdAt: new Date()
        });

        this._restaurant = this.restaurantRepository.create({
            ownerId: dataRestaurantUser.user.id,
            name: "Test Restaurant",
            address: "Test Address",
            description: "Test Description",
            location: {
                type: "Point",
                coordinates: [0, 0]
            },
            createdAt: new Date(),
            status: "on_moderation"
        });

        await this.clientProfileRepository.save(this._clientProfile);
        await this.restaurantRepository.save(this._restaurant);
    }

    get clientUser() {
        return this._clientUser;
    }

    get restaurantUser() {
        return this._restaurantUser;
    }

    async onModuleDestroy() {
        this.clientProfileRepository.delete({ userId: this._clientUser.id });
        this.restaurantRepository.delete({ ownerId: this._restaurantUser.id });
        await this.supabase.auth.admin.deleteUser(this._clientUser.id);
        await this.supabase.auth.admin.deleteUser(this._restaurantUser.id);
    }
}