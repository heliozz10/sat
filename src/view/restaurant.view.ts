import { Point } from "typeorm";
import { Restaurant } from "../entity/Restaurant";

export class RestaurantView {
    id: string;
    name: string;
    photoUrl: string;
    address: string;
    location: {
        latitude: number;
        longitude: number;
    };
    averageRating: number;
    reviewsCount: number;

    constructor(restaurant?: Restaurant) {
        if(!restaurant) {
            return;
        }
        this.id = restaurant.id;
        this.name = restaurant.name;
        this.photoUrl = restaurant.photoUrl;
        this.address = restaurant.address;
        this.location = {
            latitude: (restaurant.location as Point).coordinates[1],
            longitude: (restaurant.location as Point).coordinates[0]
        };
        this.averageRating = restaurant.averageRating;
        this.reviewsCount = restaurant.reviewsCount;
    }
}