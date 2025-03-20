// src/buyer/buyer.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Buyer } from './entities/buyer.entity';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';

@Injectable()
export class BuyerService {
  constructor(
    @InjectModel(Buyer)
    private buyerModel: typeof Buyer,
  ) {}

  async create(createBuyerDto: CreateBuyerDto): Promise<Buyer> {
    return this.buyerModel.create({ ...createBuyerDto });
  }

  async findAll(): Promise<Buyer[]> {
    return this.buyerModel.findAll();
  }

  async findOne(buyerID: string): Promise<Buyer> {
    const buyer = await this.buyerModel.findOne({
      where: { buyerID },
    });

    if (!buyer) {
      throw new NotFoundException(`Buyer with ID "${buyerID}" not found`);
    }

    return buyer;
  }

  async update(
    buyerID: string,
    updateBuyerDto: UpdateBuyerDto,
  ): Promise<Buyer> {
    const buyer = await this.findOne(buyerID);

    await buyer.update(updateBuyerDto);
    return buyer;
  }

  async remove(buyerID: string): Promise<void> {
    const buyer = await this.findOne(buyerID);
    await buyer.destroy();
  }
}
