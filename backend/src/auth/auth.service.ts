import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, Users } from 'src/schema/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in-Dto'; //

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async generateToken(id: Types.ObjectId, email: string) {
    const payload = { id: id, email: email };
    return await this.jwtService.signAsync(payload);
  }
  async create(CreateUserDto: CreateUserDto) {
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${CreateUserDto.firstName}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${CreateUserDto.firstName}`;
    const user = await this.userModel.findOne({ email: CreateUserDto.email });
    if (user) throw new ConflictException('User already exists');
    const createdUser = await this.userModel.create({
      lastName: CreateUserDto.lastName,
      firstName: CreateUserDto.firstName,
      email: CreateUserDto.email,
      password: CreateUserDto.password,
      gender: CreateUserDto.gender,
      profileImage:
        CreateUserDto.gender === 'male' ? boyProfilePic : girlProfilePic,
    });

    return {
      userId: createdUser._id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      profileImage: createdUser.profileImage,
      gender: createdUser.gender,
      email: createdUser.email,
    };
  }

  async signIn(signInDto: SignInDto): Promise<any> {
    const user = await this.userModel.findOne({ email: signInDto.email });
    if (!user) throw new NotFoundException('User not found');
    const match = await bcrypt.compare(signInDto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid password');
    return {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      gender: user.gender,
      email: user.email,
    };
  }

  async update(id: string, updateAuthDto: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate(
        { _id: id },
        {
          firstName: updateAuthDto.firstName,
          lastName: updateAuthDto.lastName,
        },
        { new: true },
      )
      .then((result) => {
        if (!result) throw new NotFoundException(`User ${id} does not exist`);
        return result;
      })
      .catch((err) => {
        throw new NotFoundException('Something wrong happened: ' + err);
      });
  }
}
