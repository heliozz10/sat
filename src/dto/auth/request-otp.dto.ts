import { IsPhoneNumber } from "class-validator";

export class RequestOtpDto {
    @IsPhoneNumber("KZ")
    phone: string
}