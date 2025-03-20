// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BuyerService } from '../buyer/buyer.service';
import { DealerService } from '../dealer/dealer.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly buyerService: BuyerService,
    private readonly dealerService: DealerService,
    private readonly jwtService: JwtService,
  ) {}

  async validateBuyer(email: string, password: string): Promise<any> {
    const buyer = await this.buyerService.findByEmail(email);
    if (!buyer) {
      return null;
    }

    // In a real app, you should hash passwords before storing them
    // This assumes plain text passwords for simplicity
    // Replace with bcrypt.compare(password, buyer.password) for hashed passwords
    const isPasswordValid = password === buyer.password;
    if (!isPasswordValid) {
      return null;
    }

    return buyer;
  }

  async validateDealer(email: string, password: string): Promise<any> {
    const dealer = await this.dealerService.findByEmail(email);
    if (!dealer) {
      return null;
    }

    // In a real app, you should hash passwords before storing them
    // This assumes plain text passwords for simplicity
    // Replace with bcrypt.compare(password, dealer.password) for hashed passwords
    const isPasswordValid = password === dealer.password;
    if (!isPasswordValid) {
      return null;
    }

    return dealer;
  }

  async loginBuyer(loginDto: LoginDto) {
    const buyer = await this.validateBuyer(loginDto.email, loginDto.password);
    if (!buyer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: buyer.buyerID,
      email: buyer.email,
      role: 'buyer',
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: buyer.buyerID,
        name: buyer.buyerName,
        email: buyer.email,
        role: 'buyer',
      },
    };
  }

  async loginDealer(loginDto: LoginDto) {
    const dealer = await this.validateDealer(loginDto.email, loginDto.password);
    if (!dealer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: dealer.dealerID,
      email: dealer.email,
      role: 'dealer',
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: dealer.dealerID,
        name: dealer.businessName,
        email: dealer.email,
        role: 'dealer',
      },
    };
  }
}
