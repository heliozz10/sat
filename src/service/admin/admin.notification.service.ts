import { Injectable } from "@nestjs/common";
import { SendNotificationDto } from "../../dto/admin/send-notification.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserNotification } from "../../entity/UserNotification";
import { Repository } from "typeorm";

@Injectable()
export class AdminNotificationService {
    constructor(
        @InjectRepository(UserNotification) private readonly notificationRepository: Repository<UserNotification>
    ) {}
    
    async sendNotification(userId: string, dto: SendNotificationDto) {
        const notification = this.notificationRepository.create({
            userId,
            message: dto.message,
            link: dto.link,
            isRead: false,
        });
        await this.notificationRepository.save(notification);
    }
}