import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly openai: OpenAI;
  private conversationHistory: { role: 'system' | 'user' | 'assistant', content: string }[] = [];
  private readonly productKnowledge = {
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

  constructor() {
    this.openai = new OpenAI({
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

  async getResponse(prompt: string): Promise<string> {
    try {
      this.conversationHistory.push({ role: 'user', content: prompt });

      // Check for price-related questions
      const priceQuestion = this.productKnowledge.products.find(product =>
        prompt.toLowerCase().includes(product.name.toLowerCase()) && prompt.toLowerCase().includes('ราคา')
      );

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

      // Check if response contains "I don't know" or similar phrases
      const uncertaintyPhrases = ['ไม่แน่ใจ', 'ไม่ทราบ', "I'm not sure", "I don't know"];
      if (uncertaintyPhrases.some(phrase => content.toLowerCase().includes(phrase.toLowerCase()))) {
        return `ขออภัยครับ ผมไม่สามารถให้ข้อมูลราคากาแฟอาราบิก้าได้ในขณะนี้ แต่คุณสามารถสอบถามรายละเอียดเพิ่มเติมได้ที่ ${this.productKnowledge.supportEmail} ครับ`;
      }

      this.conversationHistory.push({ role: 'assistant', content });

      // Maintain conversation history
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = [
          this.conversationHistory[0],
          ...this.conversationHistory.slice(-4)
        ];
      }

      return content;
    } catch (error) {
      console.error('OpenAI Error:', error.message);
      return `ขออภัยค่ะ เกิดข้อผิดพลาด กรุณาติดต่อ ${this.productKnowledge.supportEmail}`;
    }
  }
}