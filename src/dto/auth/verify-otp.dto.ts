import { IsPhoneNumber, IsString, Length } from "class-validator";

export class VerifyOtpDto{
    @IsPhoneNumber("KZ")
    phone: string;

    @IsString()
    @Length(6, 6)
    otp: string
}