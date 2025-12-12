import { Injectable, Logger } from '@nestjs/common';
import { AiProviderName } from '@repo/shared';
import { AiProvider, AiCompletionRequest, AiCompletionResponse } from '../ai-provider.interface';

@Injectable()
export class ClaudeProvider implements AiProvider {
  readonly name: AiProviderName = 'claude';
  private readonly logger = new Logger(ClaudeProvider.name);
  private readonly apiKey: string;
  private readonly defaultModel: string;
  private readonly baseUrl = 'https://api.anthropic.com/v1/messages';

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || '';
    this.defaultModel = process.env.CLAUDE_MODEL || 'claude-sonnet-4-5';
  }

  isAvailable(): boolean {
    // API key must be a non-empty string and not a placeholder
    return (
      !!this.apiKey &&
      this.apiKey.length > 10 &&
      !this.apiKey.startsWith('your_') &&
      !this.apiKey.startsWith('sk-ant-your') &&
      this.apiKey !== 'your_anthropic_api_key' &&
      this.apiKey !== 'your_anthropic_api_key_here'
    );
  }

  getDefaultModel(): string {
    return this.defaultModel;
  }

  async complete(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    const startTime = Date.now();
    const model = request.model || this.defaultModel;

    const messages = request.messages.map((msg) => ({
      role: msg.role === 'system' ? 'user' : msg.role,
      content: msg.content,
    }));

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: request.maxTokens || 2048,
          system: request.systemPrompt,
          messages,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        this.logger.error(`Claude API error: ${error}`);
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      const latencyMs = Date.now() - startTime;

      const content = data.content?.[0]?.text || '';

      return {
        provider: this.name,
        content,
        model,
        usage: data.usage
          ? {
              promptTokens: data.usage.input_tokens,
              completionTokens: data.usage.output_tokens,
              totalTokens: data.usage.input_tokens + data.usage.output_tokens,
            }
          : undefined,
        latencyMs,
      };
    } catch (error) {
      this.logger.error(`Claude completion failed: ${error}`);
      throw error;
    }
  }
}
