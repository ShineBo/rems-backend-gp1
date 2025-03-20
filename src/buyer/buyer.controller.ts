// src/buyer/buyer.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
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

  @Delete('/delete/:id')
  async remove(@Param('id') buyerID: string) {
    const destroyBuyer = await this.buyerService.remove(+buyerID);
    console.log(destroyBuyer);
    if (destroyBuyer === 0) {
      throw new NotFoundException('No buyer to remove!');
    }
    return { message: 'Buyer account successfully deleted!' };
  }
}
