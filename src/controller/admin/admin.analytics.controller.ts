import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../guard/jwt-auth.guard";
import { RolesGuard } from "../../guard/roles.guard";
import { Roles } from "../../decorator/roles.decorator";
import { AdminAnalyticsService } from "../../service/admin/admin.analytics.service";
import { AdminFinanceService } from "../../service/admin/admin.finance.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("admin/analytics")
export class AdminAnalyticsController {
    constructor(
        private readonly adminAnalyticsService: AdminAnalyticsService,
        private readonly adminFinanceService: AdminFinanceService
    ) {}

    @Get("dashboard")
    getDashboard() {
        return this.adminAnalyticsService.getMetrics();
    }

    @Get("finances")
    getFinanceAnalytics(
        @Query("startDate") startDate: string,
        @Query("endDate") endDate: string,
        @Query("withDaily") withDaily?: string
    ) {
        return this.adminFinanceService.getFinanceAnalytics(startDate, endDate, withDaily === "true");
    }
}