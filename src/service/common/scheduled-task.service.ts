import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { OfferService } from "../restaurant/offer.service";

@Injectable()
export class ScheduledTaskService {
    constructor(
        private readonly offerService: OfferService
    ) {}

    @Cron(CronExpression.EVERY_HOUR)
    async deactivateExpiredOffers() {
        this.offerService.deactivateExpiredOffers();
    }
}