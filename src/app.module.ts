// src/app.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DealerModule } from './dealer/dealer.module';
import { BuyerModule } from './buyer/buyer.module';
import { PropertyModule } from './property/property.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres', // Change based on your DB
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '    ',
      database: 'rems',
      autoLoadModels: true,
      synchronize: true,
    }),
    DealerModule,
    BuyerModule,
    PropertyModule,
  ],
})
export class AppModule {}
