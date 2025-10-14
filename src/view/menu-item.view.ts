import { MenuItem } from "../entity/MenuItem";
import { RestaurantView } from "./restaurant.view";

export class MenuItemView {
    id: string;
    restaurant: RestaurantView;
    name: string;
    description: string;
    photoUrl: string;

    constructor(menuItem?: MenuItem) {
        if(!menuItem) {
            return;
        }
        this.id = menuItem.id;
        this.restaurant = new RestaurantView(menuItem.restaurant);
        this.name = menuItem.name;
        this.description = menuItem.description;
        this.photoUrl = menuItem.photoUrl;
    }
}