import { Injectable, Logger } from '@nestjs/common';
import { AiProviderName, AVAILABLE_MODELS } from '@repo/shared';
import { AiProvider, AiCompletionRequest, AiCompletionResponse } from './ai-provider.interface';
import {
  OpenAiProvider,
  GeminiProvider,
  ClaudeProvider,
  PerplexityProvider,
} from './providers';

export interface ProviderRequestConfig {
  provider: AiProviderName;
  model?: string;
  systemPrompt?: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly providers: Map<AiProviderName, AiProvider>;

  constructor(
    private readonly openAiProvider: OpenAiProvider,
    private readonly geminiProvider: GeminiProvider,
    private readonly claudeProvider: ClaudeProvider,
    private readonly perplexityProvider: PerplexityProvider,
  ) {
    this.providers = new Map<AiProviderName, AiProvider>();
    this.providers.set('openai', this.openAiProvider);
    this.providers.set('gemini', this.geminiProvider);
    this.providers.set('claude', this.claudeProvider);
    this.providers.set('perplexity', this.perplexityProvider);
  }

  getAvailableProviders(): AiProviderName[] {
    return Array.from(this.providers.entries())
      .filter(([, provider]) => provider.isAvailable())
      .map(([name]) => name);
  }

  getProviderModels(providerName: AiProviderName) {
    return AVAILABLE_MODELS[providerName] || [];
  }

  getDefaultModel(providerName: AiProviderName): string {
    const provider = this.providers.get(providerName);
    return provider?.getDefaultModel() || '';
  }

  getProvider(name: AiProviderName): AiProvider | undefined {
    return this.providers.get(name);
  }

  async completeWithProvider(
    providerName: AiProviderName,
    request: AiCompletionRequest,
  ): Promise<AiCompletionResponse> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }
    if (!provider.isAvailable()) {
      throw new Error(`Provider ${providerName} is not available (API key missing)`);
    }
    return provider.complete(request);
  }

  async completeWithMultipleProviders(
    providerConfigs: ProviderRequestConfig[],
    messages: AiCompletionRequest['messages'],
    globalSystemPrompt?: string,
  ): Promise<AiCompletionResponse[]> {
    const availableConfigs = providerConfigs.filter((config) => {
      const provider = this.providers.get(config.provider);
      return provider?.isAvailable();
    });

    if (availableConfigs.length === 0) {
      throw new Error('No available providers');
    }

    const results = await Promise.allSettled(
      availableConfigs.map((config) => {
        const request: AiCompletionRequest = {
          messages,
          model: config.model,
          systemPrompt: config.systemPrompt || globalSystemPrompt,
        };
        return this.completeWithProvider(config.provider, request);
      }),
    );

    const successfulResults: AiCompletionResponse[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfulResults.push(result.value);
      } else {
        this.logger.warn(
          `Provider ${availableConfigs[index].provider} failed: ${result.reason}`,
        );
      }
    });

    return successfulResults;
  }
}
