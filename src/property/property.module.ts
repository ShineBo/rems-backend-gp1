import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Property } from './entities/property.entity';
import { DealerModule } from '../dealer/dealer.module';
import { JwtModule } from '@nestjs/jwt'; // ✅ Import this
import { RolesGuard } from '../auth/roles.guard'; // ✅ Import RolesGuard
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    SequelizeModule.forFeature([Property]),
    DealerModule,
    JwtModule.register({}), // ✅ Add this to resolve JwtService
  ],
  controllers: [PropertyController],
  providers: [
    PropertyService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // ✅ Ensure RolesGuard is provided globally
    },
  ],
  exports: [PropertyService],
})
export class PropertyModule {}
