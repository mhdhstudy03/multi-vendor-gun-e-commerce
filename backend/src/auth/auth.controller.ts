import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { DeviceFingerprintMiddleware } from '../common/middleware/device-fingerprint.middleware';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('send-otp')
  async sendOtp(
    @Body() sendOtpDto: SendOtpDto,
    @Request() req: any,
  ) {
    return this.authService.sendOtp(
      sendOtpDto,
      req.ipAddress || req.ip,
      req.deviceFingerprint,
    );
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Request() req: any,
  ) {
    return this.authService.verifyOtp(
      verifyOtpDto,
      req.ipAddress || req.ip,
      req.deviceFingerprint,
    );
  }
}

