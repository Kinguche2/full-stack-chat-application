import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Transform } from 'class-transformer';
import {
  IsAlpha,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
}
