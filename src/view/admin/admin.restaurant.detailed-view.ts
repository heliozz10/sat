import { Restaurant } from "../../entity/Restaurant";
import { ActiveOfferView } from "../active-offer.view";
import { AdminOrderView } from "./admin.order.view";
import { AdminRestaurantView } from "./admin.restaurant.view";
import { AdminReviewView } from "./admin.review.view";

export class AdminRestaurantDetailedView extends AdminRestaurantView {
    description: string;
    activeOffers: ActiveOfferView[];
    orders: AdminOrderView[];
    reviews: AdminReviewView[];

    constructor(restaurant?: Restaurant) {
        if(!restaurant) {
            return;
        }
        super(restaurant);
        this.description = restaurant.description;
        this.activeOffers = restaurant.activeOffers.map(offer => new ActiveOfferView(offer));
        this.orders = restaurant.orders.map(order => new AdminOrderView(order));
        this.reviews = restaurant.reviews.map(review => new AdminReviewView(review));
    }
}