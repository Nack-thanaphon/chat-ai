import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { OpenAIModule } from '../openai/openai.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    OpenAIModule, // Import OpenAI for responses
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
