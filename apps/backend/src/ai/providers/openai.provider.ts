import { Injectable, Logger } from '@nestjs/common';
import { AiProviderName } from '@repo/shared';
import { AiProvider, AiCompletionRequest, AiCompletionResponse } from '../ai-provider.interface';

@Injectable()
export class OpenAiProvider implements AiProvider {
  readonly name: AiProviderName = 'openai';
  private readonly logger = new Logger(OpenAiProvider.name);
  private readonly apiKey: string;
  private readonly defaultModel: string;
  private readonly baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.defaultModel = process.env.OPENAI_MODEL || 'gpt-5.2-instant';
  }

  isAvailable(): boolean {
    // API key must be a non-empty string and not a placeholder
    return (
      !!this.apiKey &&
      this.apiKey.length > 10 &&
      !this.apiKey.startsWith('your_') &&
      !this.apiKey.startsWith('sk-your') &&
      this.apiKey !== 'your_openai_api_key' &&
      this.apiKey !== 'your_openai_api_key_here'
    );
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
          max_completion_tokens: request.maxTokens || 2048,
          temperature: request.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        this.logger.error(`OpenAI API error: ${error}`);
        throw new Error(`OpenAI API error: ${response.status}`);
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
      this.logger.error(`OpenAI completion failed: ${error}`);
      throw error;
    }
  }
}
