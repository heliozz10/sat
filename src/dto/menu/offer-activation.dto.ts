import { IsDateString, Validate, IsUUID, Max, Min, IsIn, IsString, Length, IsOptional, IsInt } from "class-validator";
import { IsFutureDateString } from "../../validator/is-future-date-string.validator";
import { IsTimeRange } from "../../validator/is-time-range.validator";

export class OfferActivationDto {
    @Length(3, 60)
    @IsString()
    name: string;

    @IsIn(["happy_box", "single_dish"])
    type: "happy_box" | "single_dish";

    @IsOptional()
    @IsUUID()
    menuItemId?: string;

    @IsOptional()
    @IsString()
    boxCategory?: string;

    @IsDateString({strict: true})
    @Validate(IsFutureDateString, { message: "Pickup date must be a future date" })
    pickupDate: string;

    @Validate(IsTimeRange, { message: "Pickup time range is invalid. It must be in the format HH:MM-HH:MM" })
    pickupTimeRange: string;

    @IsInt()
    @Min(1, { message: "Minimum quantity is 1" })
    quantity: number;

    @Min(15, { message: "Minimum discount is 15%" })
    @Max(80, { message: "Maximum discount is 80%" })
    discount: number;
}