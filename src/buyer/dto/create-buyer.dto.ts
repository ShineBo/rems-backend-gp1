export class CreateBuyerDto {
  buyerName: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePhoto?: Buffer;
}
