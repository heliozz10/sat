import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { RolesGuard } from "../guard/roles.guard";
import { Roles } from "../decorator/roles.decorator";
import { OrderService } from "../service/client/order.service";
import { CreateOrdersDto } from "../dto/client/create-order.dto";
import { AddReviewDto } from "../dto/client/add-review.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("client")
@Controller("orders")
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) {}

    @Post("initiate-payment")
    initiatePayment(@Req() req, @Body() createOrdersDto: CreateOrdersDto) {
        return this.orderService.initiatePayment(req.user.userId, createOrdersDto);
    }

    @Get()
    getOrders(@Req() req) {
        return this.orderService.getOrders(req.user.userId);
    }

    @Post(":id/review")
    reviewOrder(@Req() req, @Param("id") orderId: string, @Body() dto: AddReviewDto) {
        return this.orderService.addReview(req.user.userId, orderId, dto);
    }
}