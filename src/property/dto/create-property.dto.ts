export class CreatePropertyDto {
  propertyTitle: string;
  propertyType: string;
  propertyImages?: Buffer;
  description: string;
  price: number;
  location: string;
  status: string;
  dealerID: number;
}
