// src/property/property.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { DealerService } from '../dealer/dealer.service';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property)
    private propertyModel: typeof Property,
    private dealerService: DealerService,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    await this.dealerService.findOne(createPropertyDto.dealerID);

    // Convert image if it's a base64 string
    if (typeof createPropertyDto.propertyImages === 'string') {
      createPropertyDto.propertyImages = Buffer.from(
        createPropertyDto.propertyImages.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
    }

    return this.propertyModel.create(createPropertyDto as any);
  }

  async findAll(): Promise<Property[]> {
    return this.propertyModel.findAll({ include: ['dealer'] });
  }

  async findOne(propertyID: string): Promise<Property> {
    const property = await this.propertyModel.findOne({
      where: { propertyID },
      include: ['dealer'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID "${propertyID}" not found`);
    }

    return property;
  }

  async findByDealer(dealerID: number): Promise<Property[]> {
    return this.propertyModel.findAll({ where: { dealerID } });
  }

  async update(propertyID: string, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    const property = await this.findOne(propertyID);

    // Handle image update
    if (updatePropertyDto.propertyImages && typeof updatePropertyDto.propertyImages === 'string') {
      updatePropertyDto.propertyImages = Buffer.from(
        updatePropertyDto.propertyImages.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
    }

    await property.update(updatePropertyDto as any);
    return property;
  }

  async remove(propertyID: string): Promise<void> {
    const property = await this.findOne(propertyID);
    await property.destroy();
  }
}