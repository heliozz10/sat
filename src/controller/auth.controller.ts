import { Body, Controller, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import { RequestOtpDto } from "../dto/auth/request-otp.dto";
import { VerifyOtpDto } from "../dto/auth/verify-otp.dto";
import { LoginDto } from "../dto/auth/login.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { CompleteRegistrationDto } from "../dto/auth/complete-registration.dto";

@UseInterceptors(FileInterceptor("photo", {
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}))
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post("register/send-otp")
    sendOtp(@Body() dto: RequestOtpDto) {
        const { phone } = dto;
        this.authService.sendOtp(phone);
    }

    @Post("register/verify-otp")
    verifyOtp(@Body() dto: VerifyOtpDto) {
        const { phone, otp } = dto;
        return this.authService.verifyOtp(phone, otp);
    }

    @Post("register")
    register(@Req() req, @Body() dto: CompleteRegistrationDto, @UploadedFile() file: Express.Multer.File) {
        return this.authService.register(req.user.sub, dto, file);
    }

    @Post("login")
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}