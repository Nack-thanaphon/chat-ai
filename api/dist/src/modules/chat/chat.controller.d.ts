import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getMessages(userId: string): Promise<import("./schemas/chat.schema").Chat[]>;
    handleUserMessage(userId: string, message: string): Promise<import("./schemas/chat.schema").Chat[]>;
}
