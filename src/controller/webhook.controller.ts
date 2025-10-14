import { Body, Controller, Post } from "@nestjs/common";

@Controller("webhooks")
export class WebhookController {
    @Post("payment-status")
    paymentStatus(@Body() payload: any) {

    }
}