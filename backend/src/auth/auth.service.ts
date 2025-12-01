import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { OtpLog } from './entities/otp-log.entity';
import { DeviceFingerprint } from './entities/device-fingerprint.entity';
import { RegisterDto } from './dto/register.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(OtpLog)
    private otpLogRepository: Repository<OtpLog>,
    @InjectRepository(DeviceFingerprint)
    private deviceFingerprintRepository: Repository<DeviceFingerprint>,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = await this.usersService.create(registerDto);
    return { message: 'Registration successful. Please verify your email.' };
  }

  async sendOtp(sendOtpDto: SendOtpDto, ipAddress: string, deviceFingerprint: string) {
    const { email } = sendOtpDto;
    
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

    // Save OTP log
    const otpLog = this.otpLogRepository.create({
      email: user.email,
      phone: user.phone,
      otp,
      ipAddress,
      deviceFingerprint,
      expiresAt,
    });
    await this.otpLogRepository.save(otpLog);

    // Send OTP via email (implement email service)
    // await this.emailService.sendOtp(user.email, otp);

    return { message: 'OTP sent to your email' };
  }

  async verifyOtp(
    verifyOtpDto: VerifyOtpDto,
    ipAddress: string,
    deviceFingerprint: string,
  ) {
    const { email, otp } = verifyOtpDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Find valid OTP
    const otpLog = await this.otpLogRepository.findOne({
      where: {
        email,
        otp,
        used: false,
        verified: false,
      },
      order: { createdAt: 'DESC' },
    });

    if (!otpLog) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (new Date() > otpLog.expiresAt) {
      throw new UnauthorizedException('OTP has expired');
    }

    // Mark OTP as used
    otpLog.used = true;
    otpLog.verified = true;
    await this.otpLogRepository.save(otpLog);

    // Check device fingerprint for suspicious activity
    await this.checkDeviceFingerprint(user.id, ipAddress, deviceFingerprint);

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  private async checkDeviceFingerprint(
    userId: string,
    ipAddress: string,
    deviceFingerprint: string,
  ) {
    const existingDevice = await this.deviceFingerprintRepository.findOne({
      where: { userId, deviceId: deviceFingerprint },
    });

    if (!existingDevice) {
      // New device - create fingerprint record
      const newDevice = this.deviceFingerprintRepository.create({
        userId,
        deviceId: deviceFingerprint,
        ipAddress,
        userAgent: '', // Should be passed from request
        isTrusted: false,
        lastSeen: new Date(),
      });
      await this.deviceFingerprintRepository.save(newDevice);

      // Trigger suspicious activity alert (implement notification service)
      // await this.notificationService.sendSuspiciousLoginAlert(userId);
    } else {
      // Update last seen
      existingDevice.lastSeen = new Date();
      existingDevice.ipAddress = ipAddress;
      await this.deviceFingerprintRepository.save(existingDevice);
    }
  }

  async validateUser(userId: string) {
    return this.usersService.findOne(userId);
  }
}

