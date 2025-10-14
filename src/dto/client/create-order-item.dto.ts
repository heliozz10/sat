import { IsNumber, IsUUID } from "class-validator";

export class CreateOrderItemDto {
    @IsUUID()
    offerId: string;
    
    @IsNumber()
    quantity: number;
}