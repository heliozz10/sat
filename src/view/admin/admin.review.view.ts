import { Review } from "../../entity/Review";
import { AdminOrderView } from "./admin.order.view";

//haha funny class name viewview
export class AdminReviewView {
    order: AdminOrderView;
    rating: number;
    createdAt: Date;
    client: {
        id: string;
        name: string;
    };
    restaurant: {
        id: string;
        name: string;
    };

    constructor(review: Review) {
        this.order = new AdminOrderView(review.order);
        this.rating = review.rating;
        this.createdAt = review.createdAt;
        this.client = {
            id: review.client.id,
            name: review.client.name
        };
        this.restaurant = {
            id: review.order.restaurant.id,
            name: review.order.restaurant.name
        };
    }
}