import { Injectable, Logger } from '@nestjs/common';
import { AiProviderName } from '@repo/shared';
import { AiProvider, AiCompletionRequest, AiCompletionResponse } from '../ai-provider.interface';

@Injectable()
export class PerplexityProvider implements AiProvider {
  readonly name: AiProviderName = 'perplexity';
  private readonly logger = new Logger(PerplexityProvider.name);
  private readonly apiKey: string;
  private readonly defaultModel: string;
  private readonly baseUrl = 'https://api.perplexity.ai/chat/completions';

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || '';
    this.defaultModel = process.env.PERPLEXITY_MODEL || 'llama-3.1-sonar-large-128k-online';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  getDefaultModel(): string {
    return this.defaultModel;
  }

  async complete(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    const startTime = Date.now();
    const model = request.model || this.defaultModel;

    const messages = request.systemPrompt
      ? [{ role: 'system', content: request.systemPrompt }, ...request.messages]
      : request.messages;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: request.maxTokens || 2048,
          temperature: request.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        this.logger.error(`Perplexity API error: ${error}`);
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      const latencyMs = Date.now() - startTime;

      return {
        provider: this.name,
        content: data.choices[0]?.message?.content || '',
        model,
        usage: data.usage
          ? {
              promptTokens: data.usage.prompt_tokens,
              completionTokens: data.usage.completion_tokens,
              totalTokens: data.usage.total_tokens,
            }
          : undefined,
        latencyMs,
      };
    } catch (error) {
      this.logger.error(`Perplexity completion failed: ${error}`);
      throw error;
    }
  }
}
