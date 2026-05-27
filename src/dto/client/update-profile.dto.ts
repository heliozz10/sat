import { IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { Geography } from "typeorm";
import { LocationDto } from "../common/location.dto";
import { Type } from "class-transformer";

export class UpdateClientProfileDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    fullName?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => LocationDto)
    location?: LocationDto;
}