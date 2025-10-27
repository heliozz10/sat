import { Body, Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../guard/jwt-auth.guard";
import { RolesGuard } from "../../guard/roles.guard";
import { Roles } from "../../decorator/roles.decorator";
import { AdminUserService } from "../../service/admin/admin.user.service";
import { UpdateUserStatusDto } from "../../dto/admin/update-user-status.dto";
import { UserStatus } from "../../enum/app.enums";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("admin/users")
export class AdminUserController {
    constructor(
        private readonly adminUserService: AdminUserService
    ) {}

    @Get()
    getUsers(
        @Query("status") status?: string,
        @Query("profile_type") profileType?: string,
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

        if(status !== "active" && status !== "blocked") {
            return {
                error: true,
                message: "status must be either active or blocked"
            }
        }

        if(profileType !== "client" && profileType !== "restaurant") {
            return {
                error: true,
                message: "profile_type must be either client or restaurant"
            }
        }

        return this.adminUserService.getUsers(pageNum, perPageNum, status, profileType);
    }

    @Get(":id")
    getUser(@Param("id") id: string) {
        return this.adminUserService.getUser(id);
    }

    @Patch(":id/status")
    updateUserStatus(
        @Param("id") id: string,
        @Body() body: UpdateUserStatusDto
    ) {
        return this.adminUserService.updateUserStatus(id, body.status as UserStatus);
    }
}