export class CreateDealerDto {
  businessName: string;
  licenseNumber: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePhoto: string | Buffer;
}
