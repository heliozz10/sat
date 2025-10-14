import { Point } from "typeorm";
import { Restaurant } from "../entity/Restaurant";
import { MenuItemView } from "./menu-item.view";
import { RestaurantView } from "./restaurant.view";
import { ActiveOfferView } from "./active-offer.view";

export class RestaurantDetailedView extends RestaurantView {
    description: string;
    activeOffers: ActiveOfferView[];

    constructor(restaurant?: Restaurant) {
        if(!restaurant) {
            return;
        }
        super(restaurant);
        this.description = restaurant.description;
        this.activeOffers = restaurant.activeOffers.map(offer => new ActiveOfferView(offer));
    }
}