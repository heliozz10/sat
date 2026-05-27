import { Module } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { DummyService } from '../service/dummy.service';
import { SupabaseClientService } from '../service/common/supabase-client.service';
import { Restaurant } from '../entity/Restaurant';
import { ClientProfile } from '../entity/ClientProfile';
import { ActiveOffer } from '../entity/ActiveOffer';
import { RestaurantModule } from './restaurant.module';
import { OfferModule } from './offer.module';
import { CatalogModule } from './catalog.module';
import { FavoriteModule } from './favorite.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduledTaskService } from '../service/common/scheduled-task.service';
import { NotificationModule } from './notification.module';
import { AdminModule } from './admin.module';
import { OrderModule } from './order.module';
import { ClientModule } from './client.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true
      }
    ),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/../entity/*{.ts,.js}'],
      logging: "all",
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Restaurant, ClientProfile]),
    ScheduleModule.forRoot(),
    AuthModule,
    RestaurantModule,
    ClientModule,
    OfferModule,
    CatalogModule,
    FavoriteModule,
    OrderModule,
    NotificationModule,
    AdminModule
  ],
  controllers: [AppController],
  providers: [AppService, DummyService, ScheduledTaskService, SupabaseClientService],
})
export class AppModule {}
