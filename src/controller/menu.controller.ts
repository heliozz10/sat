import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { MenuService } from "../service/restaurant/menu.service";
import { RolesGuard } from "../guard/roles.guard";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { Roles } from "../decorator/roles.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { MenuItemDto } from "../dto/menu/add-menu-item.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("restaurant")
@UseInterceptors(FileInterceptor("photo", {
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}))
@Controller("menu-items")
export class MenuController {
    constructor(
        private readonly menuService: MenuService
    ) {}

    @Post()
    addMenuItem(@Req() req, @Body() body: MenuItemDto, @UploadedFile() file: Express.Multer.File) {
        return this.menuService.addMenuItem(req.user.userId, body, file);
    }

    @Get()
    getMenuItems(@Req() req) {
        return this.menuService.getMenuItems(req.user.userId);
    }

    @Patch(":id")
    updateMenuItem(@Req() req, @Param("id") menuItemId: string, @Body() body: MenuItemDto, @UploadedFile() file: Express.Multer.File) {
        return this.menuService.updateMenuItem(req.user.userId, menuItemId, body, file);
    }

    @Delete(":id")
    deleteMenuItem(@Req() req, @Param("id") menuItemId: string) {
        return this.menuService.deleteMenuItem(req.user.userId, menuItemId);
    }
}