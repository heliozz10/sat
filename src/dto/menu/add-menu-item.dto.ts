import { IsNumber, IsOptional, IsString, Length } from "class-validator";

export class MenuItemDto {
    @Length(3, 60)
    name: string;

    @IsOptional()
    @Length(10, 150)
    description?: string;

    @IsNumber()
    basePrice: number;
}