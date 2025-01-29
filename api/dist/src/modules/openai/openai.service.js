"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
let OpenAIService = class OpenAIService {
    constructor() {
        this.conversationHistory = [];
        this.productKnowledge = {
            confidenceThreshold: 0.7,
            supportEmail: 'admin@example.com',
            products: [
                {
                    name: 'Arabica Premium',
                    details: {
                        origin: 'เชียงราย, ประเทศไทย',
                        roastLevel: 'Medium Roast',
                        price: 250,
                        unit: 'บาท/250g',
                        taste: 'มีความหอมละมุน รสชาติกลมกล่อม มีความเปรี้ยวอ่อนๆ',
                        process: 'Washed Process',
                        altitude: '1,200-1,500 เมตร',
                        description: 'กาแฟอราบิก้าคั่วกลาง คัดสรรจากดอยแม่สลอง จังหวัดเชียงราย'
                    }
                },
                {
                    name: 'Robusta Gold',
                    details: {
                        origin: 'ชุมพร, ประเทศไทย',
                        roastLevel: 'Dark Roast',
                        price: 200,
                        unit: 'บาท/250g',
                        taste: 'รสชาติเข้มข้น มีความขมชัดเจน หอมเข้ม',
                        process: 'Natural Process',
                        altitude: '800-1,000 เมตร',
                        description: 'กาแฟโรบัสต้าคั่วเข้ม จากแหล่งปลูกชั้นเยี่ยมในจังหวัดชุมพร'
                    }
                }
            ]
        };
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.conversationHistory.push({
            role: 'system',
            content: `
      You are a Thai-speaking AI assistant named "แอดมิน coffee-man" specializing in product support.
      When asked about your name in Thai, respond with "ผมคือ แอดมิน coffee-man".
      For product questions:
      - If confidence is high, provide detailed product information
      - If unsure, suggest contacting ${this.productKnowledge.supportEmail}
      - Use Thai language when detected
      - Keep responses concise and professional
      - For technical questions, include examples
      - Stay within ethical boundaries
      - If question is about ${this.productKnowledge.products.map(p => p.name).join(', ')}, provide specific details
      - For other questions, suggest emailing support`
        });
    }
    async getResponse(prompt) {
        try {
            this.conversationHistory.push({ role: 'user', content: prompt });
            const priceQuestion = this.productKnowledge.products.find(product => prompt.toLowerCase().includes(product.name.toLowerCase()) && prompt.toLowerCase().includes('ราคา'));
            if (priceQuestion) {
                return `ราคาของ ${priceQuestion.name} อยู่ที่ ${priceQuestion.details.price} ${priceQuestion.details.unit}`;
            }
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: this.conversationHistory,
                temperature: 0.7,
                max_tokens: 500,
                presence_penalty: 0.6
            });
            const content = response.choices[0].message?.content || '';
            const uncertaintyPhrases = ['ไม่แน่ใจ', 'ไม่ทราบ', "I'm not sure", "I don't know"];
            if (uncertaintyPhrases.some(phrase => content.toLowerCase().includes(phrase.toLowerCase()))) {
                return `ขออภัยครับ ผมไม่สามารถให้ข้อมูลราคากาแฟอาราบิก้าได้ในขณะนี้ แต่คุณสามารถสอบถามรายละเอียดเพิ่มเติมได้ที่ ${this.productKnowledge.supportEmail} ครับ`;
            }
            this.conversationHistory.push({ role: 'assistant', content });
            if (this.conversationHistory.length > 10) {
                this.conversationHistory = [
                    this.conversationHistory[0],
                    ...this.conversationHistory.slice(-4)
                ];
            }
            return content;
        }
        catch (error) {
            console.error('OpenAI Error:', error.message);
            return `ขออภัยค่ะ เกิดข้อผิดพลาด กรุณาติดต่อ ${this.productKnowledge.supportEmail}`;
        }
    }
};
exports.OpenAIService = OpenAIService;
exports.OpenAIService = OpenAIService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OpenAIService);
//# sourceMappingURL=openai.service.js.map