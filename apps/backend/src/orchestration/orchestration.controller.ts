import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { AiProviderName, AVAILABLE_MODELS, AI_PROVIDER_INFO } from '@repo/shared';
import { OrchestrationService } from './orchestration.service';
import { CreateOrchestrationDto } from './dto/orchestration.dto';

@Controller('orchestration')
export class OrchestrationController {
  private readonly logger = new Logger(OrchestrationController.name);

  constructor(private readonly orchestrationService: OrchestrationService) {}

  @Get('providers')
  getAvailableProviders() {
    const available = this.orchestrationService.getAvailableProviders();
    const allProviders: AiProviderName[] = ['openai', 'gemini', 'claude', 'perplexity'];

    return {
      providers: allProviders.map((name) => ({
        name,
        available: available.includes(name),
        ...AI_PROVIDER_INFO[name],
        defaultModel: this.orchestrationService.getDefaultModel(name),
        models: AVAILABLE_MODELS[name] || [],
      })),
    };
  }

  @Get('providers/:provider/models')
  getProviderModels(@Param('provider') provider: AiProviderName) {
    return {
      provider,
      models: this.orchestrationService.getProviderModels(provider),
      defaultModel: this.orchestrationService.getDefaultModel(provider),
    };
  }

  @Post('chat')
  async chat(@Body() dto: CreateOrchestrationDto) {
    const result = await this.orchestrationService.orchestrate({
      prompt: dto.prompt,
      providerSettings: dto.providerSettings,
      globalSystemRole: dto.globalSystemRole,
      conversationHistory: dto.conversationHistory,
    });

    return result;
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      availableProviders: this.orchestrationService.getAvailableProviders(),
      timestamp: new Date().toISOString(),
    };
  }
}
