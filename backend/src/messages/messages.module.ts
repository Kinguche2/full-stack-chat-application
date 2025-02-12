import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Messages, MessageSchema } from 'src/schema/message.schema';
import {
  Conversations,
  ConversationSchema,
} from 'src/schema/conversation.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from 'src/socket.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Messages.name, schema: MessageSchema },
      { name: Conversations.name, schema: ConversationSchema },
    ]),
    UserModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, ChatGateway],
  exports: [MongooseModule],
})
export class MessagesModule {}
