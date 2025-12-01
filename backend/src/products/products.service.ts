import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(vendorId: string, productData: Partial<Product>): Promise<Product> {
    const product = this.productsRepository.create({
      ...productData,
      vendorId,
      status: ProductStatus.PENDING,
    });
    return this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      where: { status: ProductStatus.APPROVED },
      relations: ['vendor'],
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['vendor'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findByVendor(vendorId: string): Promise<Product[]> {
    return this.productsRepository.find({
      where: { vendorId },
    });
  }

  async approve(id: string): Promise<Product> {
    const product = await this.findOne(id);
    product.status = ProductStatus.APPROVED;
    return this.productsRepository.save(product);
  }

  async reject(id: string): Promise<Product> {
    const product = await this.findOne(id);
    product.status = ProductStatus.REJECTED;
    return this.productsRepository.save(product);
  }

  async update(id: string, updateData: Partial<Product>): Promise<Product> {
    await this.productsRepository.update(id, updateData);
    return this.findOne(id);
  }
}

