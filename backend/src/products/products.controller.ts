import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('vendor/my-products')
  @UseGuards(JwtAuthGuard)
  @Roles('vendor')
  findMyProducts(@Request() req: any) {
    return this.productsService.findByVendor(req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('vendor')
  create(@Request() req: any, @Body() productData: any) {
    return this.productsService.create(req.user.id, productData);
  }
}

