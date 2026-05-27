import { IsOptional, Length, ValidateNested } from "class-validator";
import { LocationDto } from "../common/location.dto";
import { Type } from "class-transformer";
export class UpdateRestaurantDto {
    @IsOptional()
    @Length(3, 80)
    name?: string;

    @IsOptional()
    @Length(10, 150)
    description?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => LocationDto)
    location?: LocationDto;
}