// src/app.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DealerModule } from './dealer/dealer.module';
import { BuyerModule } from './buyer/buyer.module';
import { PropertyModule } from './property/property.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Dialect } from 'sequelize';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as Dialect,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadModels: true,
      sync: { alter: true },
    }),
    DealerModule,
    BuyerModule,
    PropertyModule,
    AuthModule,
  ],
})
export class AppModule {}
