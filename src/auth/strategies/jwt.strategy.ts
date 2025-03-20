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
    const secretKey = process.env.JWT_SECRET_KEY;

    if (!secretKey) {
      throw new Error('JWT_SECRET_KEY is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
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
