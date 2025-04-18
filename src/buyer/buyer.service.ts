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
import { Op } from 'sequelize'; // Import Op for advanced operators

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
    const buyer = await this.findOne(buyerID);
    
    // Only check for phone number uniqueness if the phone number is being updated
    if (updateBuyerDto.phoneNumber && updateBuyerDto.phoneNumber !== buyer.phoneNumber) {
      const checkPhone = await this.buyerModel.findOne({
        where: { 
          phoneNumber: updateBuyerDto.phoneNumber,
          buyerID: { [Op.ne]: buyer.buyerID } // Exclude the current buyer
        },
      });
      
      if (checkPhone) {
        throw new BadRequestException(
          'This phone number is already in use! Please use another.',
        );
      }
    }

    // Handle password hashing if provided
    if (updateBuyerDto.password) {
      updateBuyerDto.password = await bcrypt.hash(updateBuyerDto.password, 10);
    }

    // Update buyer data
    await buyer.update(updateBuyerDto);
    return buyer;
  }

  async remove(buyerID: number) {
    return await this.buyerModel.destroy({
      where: { buyerID: buyerID },
    });
  }
}