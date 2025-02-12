import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ConversationDocument,
  Conversations,
} from 'src/schema/conversation.schema';
import { MessageDocument, Messages } from 'src/schema/message.schema';
import { messageDto } from './dto/message-dto';
import { ChatGateway } from 'src/socket.gateway';

@Injectable()
export class MessagesService {
  constructor(
    private readonly SocketId: ChatGateway,
    @InjectModel(Conversations.name)
    private readonly ConversationModel: Model<ConversationDocument>,
    @InjectModel(Messages.name)
    private readonly MessageModel: Model<MessageDocument>,
  ) {}

  async sendMessage(messageDto: messageDto): Promise<MessageDocument> {
    const { senderId, receiverId, message } = messageDto;
    let conversation = await this.ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = new this.ConversationModel({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new this.MessageModel({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);
    const receiverSocketId = this.SocketId.getUsersSocketId(receiverId);
    if (receiverSocketId) {
      this.SocketId.handleMessage(newMessage.message, receiverId);
    }
    return newMessage;
  }

  async getMessages(userToChatId: string, senderId: string) {
    const conversation = await this.ConversationModel.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate('messages');
    if (!conversation) return [];
    const messages = conversation.messages;

    return messages;
  }
}
