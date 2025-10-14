import { IsIn, IsOptional, IsString, Length } from "class-validator";

export class UpdateRestaurantStatusDto {
    @IsIn(["approved", "blocked", "on_moderation", "rejected"])
    status: string;

    @IsOptional()
    @IsString()
    @Length(3, 100)
    reason?: string;
}