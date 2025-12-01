import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  async checkout(@Request() req: any, @Body() orderData: any) {
    return this.ordersService.create(req.user.id, orderData);
  }

  @Get('my-orders')
  async getMyOrders(@Request() req: any) {
    return this.ordersService.findByCustomer(req.user.id);
  }

  @Get('vendor/orders')
  @UseGuards(RolesGuard)
  @Roles('vendor')
  async getVendorOrders(@Request() req: any) {
    // Get vendor ID from user
    return this.ordersService.findByVendor(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'owner')
  findAll() {
    return this.ordersService.findAll();
  }
}

