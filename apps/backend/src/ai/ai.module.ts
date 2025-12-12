import { Module } from '@nestjs/common';
import { OpenAiProvider, GeminiProvider, ClaudeProvider, PerplexityProvider } from './providers';
import { AiService } from './ai.service';

@Module({
  providers: [OpenAiProvider, GeminiProvider, ClaudeProvider, PerplexityProvider, AiService],
  exports: [AiService],
})
export class AiModule {}
