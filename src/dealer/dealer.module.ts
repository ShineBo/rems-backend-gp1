// src/dealer/dealer.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DealerController } from './dealer.controller';
import { DealerService } from './dealer.service';
import { Dealer } from './entities/dealer.entity';

@Module({
  imports: [SequelizeModule.forFeature([Dealer])],
  controllers: [DealerController],
  providers: [DealerService],
  exports: [DealerService],
})
export class DealerModule {}
