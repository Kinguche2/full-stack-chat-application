import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Request } from 'express';
import { messageDto } from './dto/message-dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Types } from 'mongoose';

@Controller('api/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(AuthGuard)
  @Post('/send/:id')
  async sendMessage(
    @Req() req: Request,
    @Body('message') message: string,
    @Param('id') receiverId: string,
  ): Promise<messageDto> {
    const messageDto = {
      message: message,
      senderId: req['user']._id.toString(),
      receiverId: receiverId,
    };

    return await this.messagesService.sendMessage(messageDto);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getMessages(@Req() req: Request, @Param('id') userToChatId: string) {
    const senderId = req['user']._id.toString();
    return await this.messagesService.getMessages(senderId, userToChatId);
  }
}
