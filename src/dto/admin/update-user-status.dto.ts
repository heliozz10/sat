import { IsIn } from "class-validator";
import { UserStatus } from "../../enum/app.enums";

export class UpdateUserStatusDto {
    @IsIn(["active", "blocked"])
    status: string;
}