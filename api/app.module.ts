import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './src/modules/auth/auth.module';
import { ChatModule } from './src/modules/chat/chat.module';
import { OpenAIModule } from './src/modules/openai/openai.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env
    MongooseModule.forRoot(process.env.MONGO_URI!), // Connect to MongoDB
    AuthModule,
    ChatModule,
    OpenAIModule,
  ],
})
export class AppModule {}
