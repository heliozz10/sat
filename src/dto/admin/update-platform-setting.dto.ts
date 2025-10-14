import { Length } from "class-validator";

export class UpdatePlatformSettingDto {
    @Length(3, 64)
    key: string;

    @Length(3, 64)
    value: string;
}