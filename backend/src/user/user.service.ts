import {
  ExecutionContext,
  Injectable,
  NotFoundException,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument, Users } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard } from 'src/auth/auth.guard';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @UseGuards(AuthGuard)
  async findAll(@Request() request): Promise<UserDocument[]> {
    const loggedInUserId = request.user._id;
    const users = await this.userModel
      .find({ _id: { $ne: loggedInUserId } })
      .select('-password');
    if (users.length < 0)
      throw new NotFoundException('There are currently no users');
    return users;
  }
  async findOne(id: string) {
    return this.userModel
      .findOne({ _id: id })
      .then((user) => {
        if (!user) throw new NotFoundException('No such user');
        return user;
      })
      .catch((err) => {
        throw new NotFoundException('Something wrong happened: ' + err);
      });
    /* console.log(isExist);
    return isExist; */
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
