// src/buyer/dto/create-buyer.dto.ts
export class CreateBuyerDto {
  buyerID: string;
  buyerName: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePhoto: Buffer;
}
