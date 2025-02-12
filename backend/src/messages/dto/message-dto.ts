import { Types } from 'mongoose';

export class messageDto {
  message?: string;
  senderId?: any;
  receiverId?: any;
  _id?: Types.ObjectId;
}
