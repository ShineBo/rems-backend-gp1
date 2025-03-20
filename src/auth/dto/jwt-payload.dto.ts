// src/auth/dto/jwt-payload.dto.ts
export class JwtPayloadDto {
  id: number;
  email: string;
  role: string; // 'buyer' or 'dealer'
}
