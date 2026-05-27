import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { ClientService } from "../service/client/client.service";
import { UpdateClientProfileDto } from "../dto/client/update-profile.dto";
import { Roles } from "../decorator/roles.decorator";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { RolesGuard } from "../guard/roles.guard";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("client")
@Controller("my-profile")
export class ClientController {
    constructor(
        private readonly clientService: ClientService
    ) {}

    @Get("profile")
    getMyProfile(@Req() req) {
        return this.clientService.getClient(req.user.userId);
    }

    @Patch("profile")
    updateMyProfile(@Req() req, @Body() body: UpdateClientProfileDto) {
        return this.clientService.updateClient(req.user.userId, body);
    }
}