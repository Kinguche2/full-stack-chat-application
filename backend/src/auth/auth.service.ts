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
    const userExists = await this.userModel.findOne({
      email: CreateUserDto.email,
    });
    if (userExists) throw new ConflictException('User already exists');
    const user = await this.userModel.create({
      lastName: CreateUserDto.lastName,
      firstName: CreateUserDto.firstName,
      email: CreateUserDto.email,
      password: CreateUserDto.password,
      gender: CreateUserDto.gender,
      profileImage:
        CreateUserDto.gender === 'male' ? boyProfilePic : girlProfilePic,
    });

    return {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      gender: user.gender,
      email: user.email,
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

/* {
    "createdUser": {
        "userId": "67ad9ee6e52abfa2be883436",
        "firstName": "New",
        "lastName": "Person",
        "profileImage": "https://avatar.iran.liara.run/public/girl?username=New",
        "gender": "female",
        "email": "new@g.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YWQ5ZWU2ZTUyYWJmYTJiZTg4MzQzNiIsImVtYWlsIjoibmV3QGcuY29tIiwiaWF0IjoxNzM5NDMxNjU1LCJleHAiOjE3NDIwMjM2NTV9.WgH1eVOewWZKPp0_t1PiOdRQkCVCpl-_WDAcxGWyi2M"
} */

/* {
    "signInUser": {
        "userId": "67ad9ee6e52abfa2be883436",
        "firstName": "New",
        "lastName": "Person",
        "profileImage": "https://avatar.iran.liara.run/public/girl?username=New",
        "gender": "female",
        "email": "new@g.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YWQ5ZWU2ZTUyYWJmYTJiZTg4MzQzNiIsImVtYWlsIjoibmV3QGcuY29tIiwiaWF0IjoxNzM5NDMxODEyLCJleHAiOjE3NDIwMjM4MTJ9.Qygly-S98hZKtOLZv0USgrij-wd_FYCU5uSGYSw0Xv0"
}
 */
