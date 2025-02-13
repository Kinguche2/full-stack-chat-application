import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Res,
  InternalServerErrorException,
  Get,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in-Dto';
import { Response, Request } from 'express';
import { error } from 'console';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async signUp(@Body() createUser: CreateUserDto, @Res() res: Response) {
    const signInUser = await this.authService.create(createUser);
    const token = await this.authService.generateToken(
      signInUser.userId,
      signInUser.email,
    );

    res.cookie('token', token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // MS
      httpOnly: true,
    });
    return res.send({ signInUser, token });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const signInUser = await this.authService.signIn(signInDto);
    const token = await this.authService.generateToken(
      signInUser.userId,
      signInUser.email,
    );
    res.cookie('token', token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // MS
      httpOnly: true,
    });
    console.log(signInUser);
    return res.send({ signInUser, token });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      const cookie = req.cookies;
      if (!cookie?.token) throw new BadRequestException('Cookie must be set');
      res.clearCookie('token', { httpOnly: true });
      return res.status(204).json({ message: 'Logged out successfully' });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
