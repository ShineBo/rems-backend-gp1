// src/dealer/dealer.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Dealer } from './entities/dealer.entity';
import { CreateDealerDto } from './dto/create-dealer.dto';
import { UpdateDealerDto } from './dto/update-dealer.dto';

@Injectable()
export class DealerService {
  constructor(
    @InjectModel(Dealer)
    private dealerModel: typeof Dealer,
  ) {}

  async create(createDealerDto: CreateDealerDto): Promise<Dealer> {
    return this.dealerModel.create({ ...createDealerDto });
  }

  async findAll(): Promise<Dealer[]> {
    return this.dealerModel.findAll();
  }

  async findOne(dealerID: string): Promise<Dealer> {
    const dealer = await this.dealerModel.findOne({
      where: { dealerID },
    });

    if (!dealer) {
      throw new NotFoundException(`Dealer with ID "${dealerID}" not found`);
    }

    return dealer;
  }

  async update(
    dealerID: string,
    updateDealerDto: UpdateDealerDto,
  ): Promise<Dealer> {
    const dealer = await this.findOne(dealerID);

    await dealer.update(updateDealerDto);
    return dealer;
  }

  async remove(dealerID: string): Promise<void> {
    const dealer = await this.findOne(dealerID);
    await dealer.destroy();
  }
}
