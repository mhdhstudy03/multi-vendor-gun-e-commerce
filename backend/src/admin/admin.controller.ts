import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'owner')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  getDashboardStats() {
    return {
      totalVendors: 0,
      pendingVendors: 0,
      totalProducts: 0,
      pendingProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      pendingCompliance: 0,
    };
  }

  @Get('vendors')
  getVendors() {
    return [];
  }

  @Get('compliance/kyc')
  getKycItems() {
    return [];
  }

  @Get('compliance/licenses')
  getLicenses() {
    return [];
  }

  @Get('compliance/background-checks')
  getBackgroundChecks() {
    return [];
  }
}

