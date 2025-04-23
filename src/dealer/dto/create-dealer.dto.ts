import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateDealerDto {
  @IsNotEmpty({ message: 'Business name is required' })
  @IsString({ message: 'Business name must be a string' })
  businessName: string;

  @IsNotEmpty({ message: 'License number is required' })
  @IsString({ message: 'License number must be a string' })
  licenseNumber: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\d+$/, { message: 'Phone number must contain only numbers' })
  phoneNumber: string;

  @IsOptional()
  profilePhoto: string | Buffer;
}
