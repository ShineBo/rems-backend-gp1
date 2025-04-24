// create-property.dto.ts
export class CreatePropertyDto {
  propertyTitle: string;
  propertyType: string;
  propertyImages?: string | Buffer;
  description: string;
  price: number;
  location: string;
  status: string;
  dealerID: number;
}
