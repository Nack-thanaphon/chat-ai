export declare class OpenAIService {
    private readonly openai;
    private conversationHistory;
    private readonly productKnowledge;
    constructor();
    getResponse(prompt: string): Promise<string>;
}
