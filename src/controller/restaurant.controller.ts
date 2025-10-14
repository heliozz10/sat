import { Body, Controller, Get, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { RestaurantService } from "../service/restaurant/restaurant.service";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { RolesGuard } from "../guard/roles.guard";
import { Roles } from "../decorator/roles.decorator";
import { UpdateRestaurantDto } from "../dto/restaurant/update-restaurant.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { OrderVerificationCode } from "../dto/auth/order-verification-code.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("restaurant")
@UseInterceptors(FileInterceptor("photo", {
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}))
@Controller("my-restaurant")
export class RestaurantController {
    constructor(
        private readonly restaurantService: RestaurantService
    ) {}

    @Get("profile")
    getMyRestaurant(@Req() req) {
        return this.restaurantService.getRestaurant(req.user.userId);
    }

    @Patch("profile")
    updateMyRestaurant(@Req() req, @Body() dto: UpdateRestaurantDto, @UploadedFile() file: Express.Multer.File) {
        return this.restaurantService.updateRestaurant(req.user.userId, dto, file);
    }

    @Get("sales-history")
    getSalesHistory(@Req() req) {
        return this.restaurantService.getSalesHistory(req.user.userId);
    }

    @Post("orders/verify-code")
    verifyOrderCode(@Req() req, @Body() dto: OrderVerificationCode) {
        return this.restaurantService.verifyOrderCode(req.user.userId, dto);
    }
}