import { BadRequestException, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { RolesGuard } from "../guard/roles.guard";
import { Roles } from "../decorator/roles.decorator";
import { FavoriteService } from "../service/client/favorite.service";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("client")
@Controller("favorites")
export class FavoriteController {
    constructor(
        private readonly favoriteService: FavoriteService
    ) {}

    @Get()
    getFavorites(@Req() req) {
        return this.favoriteService.getFavorites(req.user.id);
    }

    @Post(":id")
    addFavorite(@Req() req, @Param("id") id: string) {
        if(!UUID.isValid(id)) {
            throw new BadRequestException("Invalid id");
        };
        this.favoriteService.addToFavorites(req.user.id, id);
    }

    @Delete(":id")
    removeFavorite(@Req() req, @Param("id") id: string) {
        if(!UUID.isValid(id)) {
            throw new BadRequestException("Invalid id");
        };
        this.favoriteService.removeFromFavorites(req.user.id, id);
    }
}
