import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './schemas/chat.schema';
import { OpenAIService } from '../openai/openai.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    private readonly openAIService: OpenAIService,
  ) {}

  async saveMessage(userId: string, message: string, sender: 'user' | 'bot'): Promise<Chat> {
    return this.chatModel.create({ userId, message, sender });
  }

  async getMessages(userId: string): Promise<Chat[]> {
    return this.chatModel.find({ userId }).sort({ createdAt: 1 }).exec();
  }

  async handleUserMessage(userId: string, message: string): Promise<Chat[]> {
    // Save the user message
    await this.saveMessage(userId, message, 'user');

    // Get response from OpenAI
    const botResponse = await this.openAIService.getResponse(message);
    await this.saveMessage(userId, botResponse, 'bot');

    // Return updated chat history
    return this.getMessages(userId);
  }
}
