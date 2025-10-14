import { Module } from "@nestjs/common";
import { AuthController } from "../controller/auth.controller";
import { AuthService } from "../service/auth.service";
import { SupabaseClientService } from "../service/common/supabase-client.service";
import { RedisClientService } from "../service/common/redis-client.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientProfile } from "../entity/ClientProfile";
import { Restaurant } from "../entity/Restaurant";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "../strategy/jwt.strategy";

//TODO: fix whole auth module
@Module({
    imports: [
        TypeOrmModule.forFeature([ClientProfile, Restaurant]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {expiresIn: '1d'}
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, SupabaseClientService, RedisClientService, JwtStrategy],
    exports: [JwtModule, JwtStrategy]
})
export class AuthModule {}