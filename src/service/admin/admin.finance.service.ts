import { Injectable } from "@nestjs/common";
import { SupabaseClientService } from "../common/supabase-client.service";

@Injectable()
export class AdminFinanceService {
    private supabase;

    constructor(
        private readonly supabaseClientService: SupabaseClientService
    ) {
        this.supabase = this.supabaseClientService.client;
    }

    async getFinanceAnalytics(startDate: string, endDate: string, withDaily = false) {
        const { data, error } = await this.supabase.rpc('admin_finance_analytics', {
            start_date: startDate,
            end_date: endDate,
            with_daily: withDaily
        });

        if (error) {
            throw error;
        }

        return {
            totalCustomerPayments: parseFloat(data[0].total_customer_payments),
            totalPayoutsToRestaurants: parseFloat(data[0].total_payouts_to_restaurants),
            totalPlatformProfit: parseFloat(data[0].total_platform_profit),
            daily: withDaily ? data[0].daily ?? null : undefined
        };
    }
}