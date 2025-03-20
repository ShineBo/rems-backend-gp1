// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { BuyerService } from '../../buyer/buyer.service';
import { DealerService } from '../../dealer/dealer.service';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly buyerService: BuyerService,
    private readonly dealerService: DealerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key', // Move this to environment variables in production
    });
  }

  async validate(payload: JwtPayloadDto) {
    let user: any = null;

    if (payload.role === 'buyer') {
      user = await this.buyerService.findById(payload.id);
    } else if (payload.role === 'dealer') {
      user = await this.dealerService.findById(payload.id);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
