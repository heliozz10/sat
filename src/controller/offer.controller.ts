import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { OfferService } from "../service/restaurant/offer.service";
import { OfferActivationDto } from "../dto/menu/offer-activation.dto";
import { RolesGuard } from "../guard/roles.guard";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { Roles } from "../decorator/roles.decorator";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("restaurant")
@Controller("offers")
export class OfferController {
    constructor(
        private readonly offerService: OfferService
    ) {}

    @Post("activate")
    activateOffer(@Req() req, @Body() offerActivationDto: OfferActivationDto) {
        return this.offerService.activateOffer(req.user.userId, offerActivationDto);
    }

    @Get("active")
    getActiveOffers(@Req() req) {
        return this.offerService.getActiveOffers(req.user.userId);
    }
}