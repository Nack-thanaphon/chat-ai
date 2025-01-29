import { Model } from 'mongoose';
import { Chat } from './schemas/chat.schema';
import { OpenAIService } from '../openai/openai.service';
export declare class ChatService {
    private chatModel;
    private readonly openAIService;
    constructor(chatModel: Model<Chat>, openAIService: OpenAIService);
    saveMessage(userId: string, message: string, sender: 'user' | 'bot'): Promise<Chat>;
    getMessages(userId: string): Promise<Chat[]>;
    handleUserMessage(userId: string, message: string): Promise<Chat[]>;
}
