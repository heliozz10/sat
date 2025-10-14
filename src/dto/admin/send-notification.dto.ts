import { IsOptional, IsString, Length } from "class-validator";

export class SendNotificationDto {
    @IsString()
    @Length(3, 100)
    message: string;

    @IsOptional()
    @IsString()
    @Length(3, 255)
    link?: string;
}