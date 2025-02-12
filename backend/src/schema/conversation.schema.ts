import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { MessagesModule } from 'src/messages/messages.module';
import { Users } from './user.schema';

@Schema({ timestamps: true, collection: 'Conversation' })
export class Conversations {
  @Prop({
    type: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    required: true,
  })
  participants: Users[];

  @Prop({ type: [{ type: mongoose.Schema.ObjectId, ref: 'Messages' }] })
  messages: Types.ObjectId[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversations);
export type ConversationDocument = HydratedDocument<Conversations>;
