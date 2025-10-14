import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { NotificationService } from "../service/common/notification.service";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { ReadNotificationDto } from "../dto/common/read-notification.dto";

@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ) {}

    @Get()
    getNotifications(@Req() req) {
        return this.notificationService.getNotifications(req.user.id);
    }

    @Post("mark-as-read")
    markNotificationAsRead(@Req() req, @Body() dto: ReadNotificationDto) {
        return this.notificationService.markNotificationAsRead(req.user.id, dto.notificationId);
    }
}