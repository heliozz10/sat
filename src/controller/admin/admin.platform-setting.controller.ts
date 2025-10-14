import { Body, Controller, Delete, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AdminPlatformSettingService } from "../../service/admin/admin.platform-setting.service";
import { JwtAuthGuard } from "../../guard/jwt-auth.guard";
import { RolesGuard } from "../../guard/roles.guard";
import { Roles } from "../../decorator/roles.decorator";
import { UpdatePlatformSettingDto } from "../../dto/admin/update-platform-setting.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("admin/settings")
export class AdminPlatformSettingController {
    constructor(
        private readonly adminPlatformSettingService: AdminPlatformSettingService
    ) {}

    @Get()
    getPlatformSettings() {
        return this.adminPlatformSettingService.getPlatformSettings();
    }

    @Get(":key")
    getPlatformSetting(
        @Query() key: string
    ) {
        return this.adminPlatformSettingService.getPlatformSetting(key);
    }
    
    @Post()
    setPlatformSetting(
        @Body() dto: UpdatePlatformSettingDto
    ) {
        return this.adminPlatformSettingService.setPlatformSetting(dto.key, dto.value);
    }

    @Delete(":key")
    deletePlatformSetting(
        @Query() key: string
    ) {
        return this.adminPlatformSettingService.deletePlatformSetting(key);
    }
}