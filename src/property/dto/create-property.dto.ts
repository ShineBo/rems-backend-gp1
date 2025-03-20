// src/property/dto/create-property.dto.ts
export class CreatePropertyDto {
  propertyID: string;
  propertyTitle: string;
  propertyType: string;
  propertyImages?: Buffer;
  description: string;
  price: number;
  location: string;
  status: string;
  dealerInfo: string;
  contactInfo: string;
  dealerID: string;
}
