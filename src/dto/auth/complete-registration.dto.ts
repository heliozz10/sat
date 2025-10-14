import { IsBoolean, IsEmail, IsEnum, IsIn, IsLatitude, IsLongitude, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CompleteRegistrationDto {
    @IsIn(["client", "restaurant"])
    role: "client" | "restaurant";

    @IsString()
    @MinLength(8)
    @MaxLength(64)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
        message: "Password must contain at least one letter and one number",
    })
    password: string;

    @IsString()
    @MinLength(8)
    @MaxLength(64)
    confirmPassword: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    fullName?: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    restaurantName?: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    restaurantDescription?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
    
    @IsOptional()
    @IsBoolean()
    termsAccepted?: boolean;

    @IsLatitude()
    lat: number;

    @IsLongitude()
    lng: number;
}  