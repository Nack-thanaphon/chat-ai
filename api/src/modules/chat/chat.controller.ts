import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getMessages(@Query('userId') userId: string) {
    return this.chatService.getMessages(userId);
  }

  @Post()
  async handleUserMessage(
    @Body('userId') userId: string,
    @Body('message') message: string,
  ) {
    return this.chatService.handleUserMessage(userId, message);
  }
}
