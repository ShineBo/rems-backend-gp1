import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Dealer } from './entities/dealer.entity';
import { CreateDealerDto } from './dto/create-dealer.dto';
import { UpdateDealerDto } from './dto/update-dealer.dto';
import { Property } from '../property/entities/property.entity';

@Injectable()
export class DealerService {
  constructor(
    @InjectModel(Dealer)
    private dealerModel: typeof Dealer,
  ) {}

  async create(createDealerDto: CreateDealerDto): Promise<Dealer> {
    // Process the profile photo if it's a string
    if (typeof createDealerDto.profilePhoto === 'string') {
      createDealerDto.profilePhoto = Buffer.from(
        createDealerDto.profilePhoto.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
    }
  
    // Fix: Use type assertion to tell TypeScript this is a valid input
    return this.dealerModel.create(createDealerDto as any);
  }

  async findAll(): Promise<Dealer[]> {
    return this.dealerModel.findAll({
      include: [Property], // Include associated properties
    });
  }

  async findOne(dealerID: number): Promise<Dealer> {
    const dealer = await this.dealerModel.findOne({
      where: { dealerID },
      include: [Property], // Include associated properties
    });

    if (!dealer) {
      throw new NotFoundException(`Dealer with ID "${dealerID}" not found`);
    }

    return dealer;
  }

  async update(
    dealerID: number,
    updateDealerDto: UpdateDealerDto,
  ): Promise<Dealer> {
    const dealer = await this.findOne(dealerID);

    if (
      updateDealerDto.profilePhoto &&
      typeof updateDealerDto.profilePhoto === 'string'
    ) {
      updateDealerDto.profilePhoto = Buffer.from(
        updateDealerDto.profilePhoto.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
    }

    await dealer.update(updateDealerDto as any);
    return dealer;
  }

  async remove(dealerID: number): Promise<void> {
    const dealer = await this.findOne(dealerID);
    await dealer.destroy();
  }
}