import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { AdminClientService } from "../../service/admin/admin.client.service";
import { JwtAuthGuard } from "../../guard/jwt-auth.guard";
import { RolesGuard } from "../../guard/roles.guard";
import { Roles } from "../../decorator/roles.decorator";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("admin/clients")
export class AdminClientController {
    constructor(
        private readonly adminClientService: AdminClientService
    ) {}

    @Get()
    getClients(
        @Query("name_query") nameQuery?: string,
        @Query("phone") phone?: string,
        @Query("page") page: string = "1",
        @Query("per_page") perPage: string = "20"
    ) {
        let pageNum = parseInt(page);
        let perPageNum = parseInt(perPage);

        if(isNaN(pageNum) || isNaN(perPageNum)) {
            return {
                error: true,
                message: "page and per_page must be numbers"
            }
        }

        return this.adminClientService.getClients(pageNum, perPageNum, nameQuery, phone);
    }

    @Get(":id")
    getClient(@Param("id") clientId: string) {
        return this.adminClientService.getClient(clientId);
    }
}