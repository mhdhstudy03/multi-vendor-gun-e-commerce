import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('vendors')
@UseGuards(JwtAuthGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get('me')
  async getMe(@Request() req: any) {
    return this.vendorsService.findByUserId(req.user.id);
  }

  @Get('dashboard/stats')
  async getDashboardStats(@Request() req: any) {
    // Implementation for vendor dashboard stats
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      pendingPayouts: 0,
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'owner')
  findAll() {
    return this.vendorsService.findAll();
  }

  @Post(':id/approve')
  @UseGuards(RolesGuard)
  @Roles('admin', 'owner')
  approve(@Param('id') id: string) {
    return this.vendorsService.approve(id);
  }

  @Post(':id/reject')
  @UseGuards(RolesGuard)
  @Roles('admin', 'owner')
  reject(@Param('id') id: string) {
    return this.vendorsService.reject(id);
  }
}

