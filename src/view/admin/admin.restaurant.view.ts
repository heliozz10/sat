import { Restaurant } from "../../entity/Restaurant";
import { RestaurantView } from "../restaurant.view";

export class AdminRestaurantView extends RestaurantView {
    ownerId: string;
    status: string;
    
    constructor(restaurant?: Restaurant) {
        if(!restaurant) {
            return;
        }
        super(restaurant);
        this.ownerId = restaurant.ownerId;
        this.status = restaurant.status;
    }
}