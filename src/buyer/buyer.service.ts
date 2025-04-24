// src/buyer/buyer.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Buyer } from './entities/buyer.entity';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';

@Injectable()
export class BuyerService {
  constructor(
    @InjectModel(Buyer)
    private buyerModel: typeof Buyer,
  ) {}

  async create(createBuyerDto: CreateBuyerDto): Promise<Buyer> {
    const checkEmail = await this.buyerModel.findOne({
      where: { email: createBuyerDto.email },
    });
    if (checkEmail) {
      throw new BadRequestException(
        'This email is already in use! Please use another.',
      );
    }

    const checkPhone = await this.buyerModel.findOne({
      where: { phoneNumber: createBuyerDto.phoneNumber },
    });
    if (checkPhone) {
      throw new BadRequestException(
        'This phone number is already in use! Please use another.',
      );
    }

    createBuyerDto.password = await bcrypt.hash(createBuyerDto.password, 10);

    // Convert base64 profile photo
    if (typeof createBuyerDto.profilePhoto === 'string') {
      createBuyerDto.profilePhoto = Buffer.from(
        createBuyerDto.profilePhoto.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
    }

    return this.buyerModel.create(createBuyerDto as any);
  }

  async findAll(): Promise<Buyer[]> {
    return this.buyerModel.findAll();
  }

  async findOne(buyerID: string): Promise<Buyer> {
    const buyer = await this.buyerModel.findOne({ where: { buyerID } });
    if (!buyer)
      throw new NotFoundException(`Buyer with ID "${buyerID}" not found`);
    return buyer;
  }

  async findById(buyerID: number): Promise<Buyer | null> {
    return this.buyerModel.findByPk(buyerID);
  }

  async findByEmail(email: string): Promise<Buyer | null> {
    return this.buyerModel.findOne({ where: { email } });
  }

  async update(
    buyerID: string,
    updateBuyerDto: UpdateBuyerDto,
  ): Promise<Buyer> {
    const buyer = await this.findOne(buyerID);
    const updates: any = {};

    if (updateBuyerDto.buyerName !== undefined)
      updates.buyerName = updateBuyerDto.buyerName;

    if (updateBuyerDto.phoneNumber !== undefined) {
      if (!/^\d+$/.test(updateBuyerDto.phoneNumber)) {
        throw new BadRequestException('Phone number must contain only numbers');
      }

      if (updateBuyerDto.phoneNumber !== buyer.phoneNumber) {
        const checkPhone = await this.buyerModel.findOne({
          where: {
            phoneNumber: updateBuyerDto.phoneNumber,
            buyerID: { [Op.ne]: buyer.buyerID },
          },
        });
        if (checkPhone) {
          throw new BadRequestException(
            'This phone number is already in use! Please use another.',
          );
        }
      }

      updates.phoneNumber = updateBuyerDto.phoneNumber;
    }

    if (updateBuyerDto.password) {
      updates.password = await bcrypt.hash(updateBuyerDto.password, 10);
    }

    if (
      updateBuyerDto.profilePhoto &&
      typeof updateBuyerDto.profilePhoto === 'string'
    ) {
      updates.profilePhoto = Buffer.from(
        updateBuyerDto.profilePhoto.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
    }

    if (Object.keys(updates).length === 0) return buyer;

    await buyer.update(updates);
    return buyer;
  }

  async remove(buyerID: number) {
    return await this.buyerModel.destroy({ where: { buyerID } });
  }
}
