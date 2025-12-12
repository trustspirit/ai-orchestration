import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { OrchestrationModule } from './orchestration/orchestration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    AiModule,
    OrchestrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
