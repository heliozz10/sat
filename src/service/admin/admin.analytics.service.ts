import { Injectable } from "@nestjs/common";
import { SupabaseClientService } from "../common/supabase-client.service";
import { AdminMetricsView } from "../../view/admin/admin.metrics.view";

@Injectable()
export class AdminAnalyticsService {
    private supabase;

    constructor(
        private readonly supabaseClientService: SupabaseClientService
    ) {
        this.supabase = this.supabaseClientService.client;
    }

    async getMetrics(): Promise<AdminMetricsView> {
        const { data: metricsRaw, error } = await this.supabase.rpc('admin_dashboard_metrics');

        if (error) {
            throw error;
        }

        return {
            newUsersToday: metricsRaw[0].new_users_today,
            newRestaurantsToday: metricsRaw[0].new_restaurants_today,
            totalOrdersToday: metricsRaw[0].total_orders_today,
            completedOrdersToday: metricsRaw[0].completed_orders_today,
            totalRevenueToday: metricsRaw[0].total_revenue_today,
            restaurantsOnModerationCount: metricsRaw[0].restaurants_on_moderation_count
        };
    }
}