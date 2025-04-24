import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateBuyerDto {
  @IsNotEmpty({ message: 'Buyer name is required' })
  @IsString({ message: 'Buyer name must be a string' })
  buyerName: string;

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
