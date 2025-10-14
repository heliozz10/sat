import { Type } from "class-transformer";
import { IsNumber, IsUUID, ValidateNested } from "class-validator";
import { CreateOrderItemDto } from "./create-order-item.dto";

export class CreateOrdersDto {
    @ValidateNested({each: true})
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}