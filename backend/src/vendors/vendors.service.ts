import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor, VendorStatus } from './entities/vendor.entity';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
  ) {}

  async create(userId: string, vendorData: Partial<Vendor>): Promise<Vendor> {
    const vendor = this.vendorsRepository.create({
      ...vendorData,
      userId,
      status: VendorStatus.PENDING,
    });
    return this.vendorsRepository.save(vendor);
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorsRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Vendor> {
    const vendor = await this.vendorsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async findByUserId(userId: string): Promise<Vendor> {
    return this.vendorsRepository.findOne({ where: { userId } });
  }

  async approve(id: string): Promise<Vendor> {
    const vendor = await this.findOne(id);
    vendor.status = VendorStatus.APPROVED;
    return this.vendorsRepository.save(vendor);
  }

  async reject(id: string): Promise<Vendor> {
    const vendor = await this.findOne(id);
    vendor.status = VendorStatus.REJECTED;
    return this.vendorsRepository.save(vendor);
  }

  async update(id: string, updateData: Partial<Vendor>): Promise<Vendor> {
    await this.vendorsRepository.update(id, updateData);
    return this.findOne(id);
  }
}

