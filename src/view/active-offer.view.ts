import { ActiveOffer } from "../entity/ActiveOffer";
import { MenuItemView } from "./menu-item.view";

export class ActiveOfferView {
    id: string;
    type: "happy_box" | "single_dish";
    boxCategory?: string;
    menuItem?: MenuItemView;
    name: string;
    quantity: number;
    pickupDate: string;
    pickupTimeRange: string;
    price: number;

    constructor(activeOffer?: ActiveOffer) {
        if(!activeOffer) {
            return;
        }
        
        this.id = activeOffer.id;
        this.type = activeOffer.type;
        this.boxCategory = activeOffer.boxCategory;
        this.menuItem = new MenuItemView(activeOffer.menuItem);
        this.name = activeOffer.name;
        this.quantity = activeOffer.quantity;
        this.pickupDate = activeOffer.pickupDate;
        this.pickupTimeRange = activeOffer.pickupTimeRange;
        this.price = activeOffer.customerPrice;
    }
}