import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserNotification } from "../../entity/UserNotification";

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(UserNotification) private readonly notificationRepository: Repository<UserNotification>
    ) {}

    async getNotifications(userId: string) {
        return this.notificationRepository.findBy({userId});
    }

    async markNotificationAsRead(userId: string, notificationId: string) {
        return this.notificationRepository.update({id: notificationId, userId}, {isRead: true});
    }
}