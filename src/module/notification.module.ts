import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserNotification } from "../entity/UserNotification";
import { NotificationService } from "../service/common/notification.service";
import { NotificationController } from "../controller/notification.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserNotification])
    ],
    controllers: [NotificationController],
    providers: [NotificationService],
    exports: []
})
export class NotificationModule {}