import { Order } from "../../entity/Order";

export class AdminOrderView {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: "cancelled" | "completed" | "expired" | "paid" | "pending";
    client: {
        id: string;
        name: string;
    };
    restaurant: {
        id: string;
        name: string;
    };
    totalCustomerPaid: number;
    totalRestaurantPayout: number;
    totalPlatformProfit: number;

    constructor(order: Order) {
        this.id = order.id;
        this.createdAt = order.createdAt;
        this.updatedAt = order.updatedAt;
        this.status = order.status;
        this.client = {
            id: order.client.id,
            name: order.client.name
        };
        this.restaurant = {
            id: order.restaurant.id,
            name: order.restaurant.name
        };
        this.totalCustomerPaid = order.totalCustomerPaid;
        this.totalRestaurantPayout = order.totalRestaurantPayout;
        this.totalPlatformProfit = order.totalPlatformProfit;
    }
}