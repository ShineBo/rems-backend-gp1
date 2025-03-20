// src/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('buyer/login')
  async buyerLogin(@Body() loginDto: LoginDto) {
    return this.authService.loginBuyer(loginDto);
  }

  @Post('dealer/login')
  async dealerLogin(@Body() loginDto: LoginDto) {
    return this.authService.loginDealer(loginDto);
  }
}
