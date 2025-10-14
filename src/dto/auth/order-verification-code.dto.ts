import { IsAlphanumeric, Length } from "class-validator";

export class OrderVerificationCode{
    @IsAlphanumeric()
    @Length(6, 6)
    code: string
}