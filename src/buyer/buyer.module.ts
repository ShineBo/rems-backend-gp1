// src/buyer/buyer.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BuyerController } from './buyer.controller';
import { BuyerService } from './buyer.service';
import { Buyer } from './entities/buyer.entity';

@Module({
  imports: [SequelizeModule.forFeature([Buyer])],
  controllers: [BuyerController],
  providers: [BuyerService],
  exports: [BuyerService],
})
export class BuyerModule {}
