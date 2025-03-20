import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Dealer } from './entities/dealer.entity';
import { CreateDealerDto } from './dto/create-dealer.dto';
import { UpdateDealerDto } from './dto/update-dealer.dto';
import { Property } from '../property/entities/property.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DealerService {
  constructor(
    @InjectModel(Dealer)
    private dealerModel: typeof Dealer,
  ) {}

  async create(createDealerDto: CreateDealerDto): Promise<Dealer> {
    // Hash the password before storing it
    const checkEmail = await this.dealerModel.findOne({
      where: { email: createDealerDto.email },
    });
    if (checkEmail) {
      throw new BadRequestException(
        'This email is already in use! Please use another.',
      );
    }
    const checkPhone = await this.dealerModel.findOne({
      where: { phoneNumber: createDealerDto.phoneNumber },
    });
    if (checkPhone) {
      throw new BadRequestException(
        'This phone number is already in use! Please use another.',
      );
    }

    if (createDealerDto.password) {
      // eslint-disable-next-line prettier/prettier
      createDealerDto.password = await bcrypt.hash(createDealerDto.password, 10);;
    }

    // Process profile photo if it's a string
    if (typeof createDealerDto.profilePhoto === 'string') {
      createDealerDto.profilePhoto = Buffer.from(
        createDealerDto.profilePhoto.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.dealerModel.create(createDealerDto as any);
  }

  // Find dealer by ID
  async findById(dealerID: number): Promise<Dealer | null> {
    return this.dealerModel.findByPk(dealerID);
  }

  // Find dealer by email
  async findByEmail(email: string): Promise<Dealer | null> {
    return this.dealerModel.findOne({
      where: {
        email,
      },
    });
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

    // Hash the new password before updating
    if (updateDealerDto.password) {
      updateDealerDto.password = await bcrypt.hash(
        updateDealerDto.password,
        10,
      );
    }

    if (
      updateDealerDto.profilePhoto &&
      typeof updateDealerDto.profilePhoto === 'string'
    ) {
      updateDealerDto.profilePhoto = Buffer.from(
        updateDealerDto.profilePhoto.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await dealer.update(updateDealerDto as any);
    return dealer;
  }

  async remove(dealerID: number): Promise<void> {
    const dealer = await this.findOne(dealerID);
    await dealer.destroy();
  }
}
