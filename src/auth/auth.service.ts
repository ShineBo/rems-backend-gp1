/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

    const isPasswordValid = await bcrypt.compare(password, buyer.password);
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

    const isPasswordValid = await bcrypt.compare(password, dealer.password);
    if (!isPasswordValid) {
      return null;
    }

    return dealer;
  }

  async loginBuyer(loginDto: LoginDto) {
    console.log('Attempting to login buyer with email:', loginDto.email);
    const buyer = await this.buyerService.findByEmail(loginDto.email);
    console.log('Buyer found:', buyer ? 'yes' : 'no');

    if (!buyer) {
      throw new UnauthorizedException('Invalid credentials - user not found');
    }

    // Debug password comparison
    console.log(
      'Comparing passwords:',
      loginDto.password,
      'vs',
      buyer.password,
    );
    const isPasswordValid = loginDto.password === buyer.password;
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid credentials - password mismatch',
      );
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
