// src/dealer/dealer.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DealerService } from './dealer.service';
import { CreateDealerDto } from './dto/create-dealer.dto';
import { UpdateDealerDto } from './dto/update-dealer.dto';
import { Dealer } from './entities/dealer.entity';

@Controller('dealer')
export class DealerController {
  constructor(private readonly dealerService: DealerService) {}

  @Post()
  create(@Body() createDealerDto: CreateDealerDto): Promise<Dealer> {
    return this.dealerService.create(createDealerDto);
  }

  @Get()
  findAll(): Promise<Dealer[]> {
    return this.dealerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Dealer> {
    return this.dealerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDealerDto: UpdateDealerDto,
  ): Promise<Dealer> {
    return this.dealerService.update(id, updateDealerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.dealerService.remove(id);
  }
}
