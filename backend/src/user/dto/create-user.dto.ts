import { Transform } from 'class-transformer';
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

enum Gender {
  Male = 'male',
  Female = 'female',
}

const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=username}`;
const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=username}`;

export class CreateUserDto {
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @MinLength(2, { message: 'First name must be 2 characters long' })
  firstName: string;

  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @MinLength(2, { message: 'Last name Minimun lenght is 2 characters' })
  @MaxLength(50, { message: 'Last Name maximum lenght is 50 characters' })
  @IsAlpha('en-US', { message: 'Must have an alpha character' })
  @IsNotEmpty({ message: `Last name can not be empty` })
  lastName: string;

  @Transform(({ value }): string => (value as string).trim().toLowerCase())
  @IsEmail()
  @IsNotEmpty({ message: `Email can not be empty` })
  @MaxLength(100, { message: `Max length for email is 100` })
  email: string;

  profileImage?: string;

  gender: Gender;

  @IsString()
  @MinLength(8, { message: 'Password must be 8 characters long' })
  @MaxLength(20, { message: 'Password maximum lenght is 20 characters' })
  @IsNotEmpty({ message: `Password can not be empty` })
  @Transform(({ value }): string => value.trim())
  password: string;
  emailVerified?: boolean;
}
