import { BadRequestException, ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CompleteRegistrationDto } from "../dto/auth/complete-registration.dto";
import { ClientProfile } from "../entity/ClientProfile";
import { Restaurant } from "../entity/Restaurant";
import { Repository } from "typeorm";
import { SupabaseClientService } from "./common/supabase-client.service";
import { RedisClientService } from "./common/redis-client.service";
import { LoginDto } from "../dto/auth/login.dto";
import * as jwt from 'jsonwebtoken';
import { SupabaseClient } from "@supabase/supabase-js";
import { GeographyService } from "./common/geography.service";
import { RestaurantStatus } from "../enum/app.enums";
import { FileService } from "./common/file.service";

@Injectable()
export class AuthService {
    private supabase: SupabaseClient<any, "public", any>;
    private redis;

    constructor(
        private readonly supabaseClientService: SupabaseClientService,
        private readonly redisClientService: RedisClientService, 
        private readonly geographyService: GeographyService,
        private readonly fileService: FileService,
        @InjectRepository(Restaurant) private restaurantRepository: Repository<Restaurant>,
        @InjectRepository(ClientProfile) private clientProfileRepository: Repository<ClientProfile>
    ) {
        this.supabase = this.supabaseClientService.client;
        this.redis = this.redisClientService.client;
    }

    async sendOtp(phone: string) {
        const { data, error } = await this.supabase.auth.signInWithOtp({ 
            phone: phone, 
            options: {
                data: { 
                    registration_finished: false
                }     
            } 
        });
        if(error) {
            throw error;
        }
        return data;
    }

    async verifyOtp(phone: string, otp: string) {
        const {data, error} = await this.supabase.auth.verifyOtp({ 
            phone: phone, 
            token: otp,
            type: "sms"
        });
        if(error) {
            throw error;
        }
        return data;
    }

    async register(userId: string, dto: CompleteRegistrationDto, photo?: Express.Multer.File) {
        const { data, error } = await this.supabase.auth.admin.getUserById(userId);
        
        if(error) throw error;

        if(!data.user.phone_confirmed_at) {
            throw new BadRequestException("Phone number is not verified");
        }

        const { data: newData, error: newError } = await this.supabase.auth.admin.updateUserById(
            userId,
            {
                password: dto.password,
                user_metadata: {
                    registration_finished: true,
                    profile_type: dto.role
                }
            }
        );

        if(newError) throw error;

        if(dto.role === "restaurant") {
            if(!photo) {
                throw new BadRequestException("A photo of the restaurant must be uploaded");
            }

            await this.uploadPhoto(userId, photo);

            this.restaurantRepository.create({
                ownerId: userId,
                name: dto.restaurantName,
                address: await this.geographyService.getAddressFromCoordinates(dto.lat, dto.lng),
                description: dto.restaurantDescription,
                location: {
                    type: "Point",
                    coordinates: [dto.lng, dto.lat]
                },
                createdAt: new Date(),
                status: "on_moderation"
            });
        } else if(dto.role === "client") {
            this.clientProfileRepository.create({
                userId: userId,
                name: dto.fullName,
                address: await this.geographyService.getAddressFromCoordinates(dto.lat, dto.lng),
                location: {
                    type: "Point",
                    coordinates: [dto.lng, dto.lat]
                },
                createdAt: new Date(),
            });
        }
    }

    async login(dto: LoginDto) {
        const { phone, password } = dto;

        const { data, error } = await this.supabase.auth.signInWithPassword({ phone, password });

        if(error) {
            throw new UnauthorizedException(error.message);
        }

        const userId = data.user.id;
        const profileType = data.user.user_metadata.profile_type;

        const accessToken = this.generateToken(userId, profileType, "15m");
        const refreshToken = this.generateToken(userId, profileType, "7d");

        return { accessToken, refreshToken, profileType };
    }

    async refresh(refreshToken: string) {
        try {
            const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
            if(typeof payload === "string") {
                throw new Error(`payload is string for some reason. here it is: ${payload}`);
            }
            const accessToken = this.generateToken(payload["sub"], payload["role"], "15m");
            return { accessToken };
        } catch {
            throw new UnauthorizedException("Invalid refresh token");
        }
    }

    private generateToken(userId: string, profileType: string, expiresIn: string) {
        return jwt.sign({ sub: userId, role: profileType }, process.env.JWT_SECRET, { expiresIn });
    }

    private async uploadPhoto(userId: string, newPhoto: Express.Multer.File): Promise<string> {
        const fileExtension = newPhoto.originalname.split('.').pop();
        const filePath = `restaurants/${userId}/${new Date()}.${fileExtension}`;

        await this.fileService.uploadFile(newPhoto, 'restaurant-photos', filePath);

        return await this.fileService.getPublicUrl('restaurant-photos', filePath);
    }
}