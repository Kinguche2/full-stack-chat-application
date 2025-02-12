import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Users } from './user.schema';

@Schema({ timestamps: true, collection: 'Message' })
export class Messages {
  @Prop({ required: true, type: mongoose.Schema.ObjectId, ref: 'User' })
  senderId: Users;

  @Prop({ required: true, type: mongoose.Schema.ObjectId, ref: 'User' })
  receiverId: Users;

  @Prop({ required: true })
  message: string;
}

export const MessageSchema = SchemaFactory.createForClass(Messages);
export type MessageDocument = HydratedDocument<Messages>;
