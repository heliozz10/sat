import { IsPhoneNumber, IsString } from "class-validator";

export class LoginDto {
    @IsPhoneNumber("KZ")
    phone: string;

    @IsString()
    password: string;
}