import { IsUUID } from "class-validator";

export class FavoriteRestaurantDto {
    @IsUUID()
    id: string;
}