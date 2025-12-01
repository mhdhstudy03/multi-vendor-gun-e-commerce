import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';

export enum UserRole {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEnum(UserRole)
  role: UserRole;
}

