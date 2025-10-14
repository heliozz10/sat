import { Body, Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../guard/jwt-auth.guard";
import { RolesGuard } from "../../guard/roles.guard";
import { Roles } from "../../decorator/roles.decorator";
import { AdminRestaurantService } from "../../service/admin/admin.restaurant.service";
import { UpdateRestaurantStatusDto } from "../../dto/admin/update-restaurant-status.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller('admin/restaurants')
export class AdminRestaurantController {
    constructor(
        private readonly adminRestaurantService: AdminRestaurantService
    ) {}

    @Get()
    getRestaurants(
        @Query("statuses") statuses?: string,
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
        
        if(statuses) {
            return this.adminRestaurantService.getRestaurants(pageNum, perPageNum, statuses.split(",").map(status => status.trim()));
        }

        return this.adminRestaurantService.getRestaurants(pageNum, perPageNum);
    }

    @Get(":id")
    getRestaurant(@Param("id") id: string) {
        return this.adminRestaurantService.getRestaurant(id);
    }

    @Patch(":id/status")
    updateRestaurantStatus(
        @Param("id") id: string,
        @Body() dto: UpdateRestaurantStatusDto
    ) {
        return this.adminRestaurantService.updateRestaurantStatus(id, dto);
    }
}