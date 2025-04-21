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
    const hashedPswrd = await bcrypt.hash(createBuyerDto.password, 10);
    return this.buyerModel.create({
      ...createBuyerDto,
      password: hashedPswrd,
    });
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

  // Find buyer by ID
  async findById(buyerID: number): Promise<Buyer | null> {
    return this.buyerModel.findByPk(buyerID);
  }

  // Find buyer by email
  async findByEmail(email: string): Promise<Buyer | null> {
    return this.buyerModel.findOne({
      where: {
        email,
      },
    });
  }

  async update(
    buyerID: string,
    updateBuyerDto: UpdateBuyerDto,
  ): Promise<Buyer> {
    // Find the buyer first
    const buyer = await this.findOne(buyerID);

    // Create clean update object - only include fields that are provided
    const updates: any = {};

    // Handle name update
    if (updateBuyerDto.buyerName !== undefined) {
      updates.buyerName = updateBuyerDto.buyerName;
    }

    // Handle phone number update - Only check uniqueness if it's being changed
    if (updateBuyerDto.phoneNumber !== undefined) {
      // Validate phoneNumber format first
      if (!/^\d+$/.test(updateBuyerDto.phoneNumber)) {
        throw new BadRequestException('Phone number must contain only numbers');
      }

      // Only check for uniqueness if the number is actually different
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

    // Handle password update
    if (updateBuyerDto.password) {
      updates.password = await bcrypt.hash(updateBuyerDto.password, 10);
    }

    // Handle profile photo update
    if (updateBuyerDto.profilePhoto !== undefined) {
      updates.profilePhoto = updateBuyerDto.profilePhoto;
    }

    // Check if there's anything to update
    if (Object.keys(updates).length === 0) {
      return buyer; // Return existing buyer if nothing to update
    }

    // Update and return the buyer
    await buyer.update(updates);
    return buyer;
  }

  async remove(buyerID: number) {
    return await this.buyerModel.destroy({
      where: { buyerID: buyerID },
    });
  }
}
