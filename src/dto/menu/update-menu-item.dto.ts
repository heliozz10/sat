import { IsNumber, IsOptional, IsString, Length } from "class-validator";

export class MenuItemDto {
    @IsOptional()
    @Length(3, 60)
    name: string;

    @IsOptional()
    @Length(10, 150)
    description: string;

    @IsOptional()
    @IsNumber()
    basePrice: number;
}