// src/buyer/buyer.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { Buyer } from './entities/buyer.entity';

@Controller('buyer')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @Post()
  create(@Body() createBuyerDto: CreateBuyerDto): Promise<Buyer> {
    return this.buyerService.create(createBuyerDto);
  }

  @Get()
  findAll(): Promise<Buyer[]> {
    return this.buyerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Buyer> {
    return this.buyerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBuyerDto: UpdateBuyerDto,
  ): Promise<Buyer> {
    return this.buyerService.update(id, updateBuyerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.buyerService.remove(id);
  }
}
