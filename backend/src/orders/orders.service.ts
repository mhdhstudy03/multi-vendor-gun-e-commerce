import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private productsService: ProductsService,
  ) {}

  async create(customerId: string, orderData: any): Promise<Order> {
    const { items, shippingAddress } = orderData;

    // Calculate total and validate products
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await this.productsService.findOne(item.productId);
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order
    const order = this.ordersRepository.create({
      customerId,
      vendorId: orderItems[0]?.productId ? (await this.productsService.findOne(orderItems[0].productId)).vendorId : null,
      totalAmount,
      shippingAddress,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Create order items
    for (const item of orderItems) {
      const orderItem = this.orderItemsRepository.create({
        orderId: savedOrder.id,
        ...item,
      });
      await this.orderItemsRepository.save(orderItem);
    }

    return this.findOne(savedOrder.id);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['customer', 'vendor', 'items', 'items.product'],
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['customer', 'vendor', 'items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findByCustomer(customerId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { customerId },
      relations: ['vendor', 'items', 'items.product'],
    });
  }

  async findByVendor(vendorId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { vendorId },
      relations: ['customer', 'items', 'items.product'],
    });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.ordersRepository.save(order);
  }
}

