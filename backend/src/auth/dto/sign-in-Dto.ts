import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class SignInDto {
  @Transform(({ value }): string => (value as string).trim().toLowerCase())
  @IsEmail()
  @IsNotEmpty({ message: `Email can not be empty` })
  @MaxLength(100, { message: `Max length for email is 100` })
  email: string;

  @IsNotEmpty({ message: `Password can not be empty` })
  password: string;
}
