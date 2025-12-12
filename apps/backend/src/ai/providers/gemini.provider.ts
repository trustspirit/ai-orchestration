import { Injectable, Logger } from '@nestjs/common';
import { AiProviderName } from '@repo/shared';
import { AiProvider, AiCompletionRequest, AiCompletionResponse } from '../ai-provider.interface';

@Injectable()
export class GeminiProvider implements AiProvider {
  readonly name: AiProviderName = 'gemini';
  private readonly logger = new Logger(GeminiProvider.name);
  private readonly apiKey: string;
  private readonly defaultModel: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.defaultModel = process.env.GEMINI_MODEL || 'gemini-1.5-pro';
  }

  private getBaseUrl(model: string): string {
    return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
  }

  isAvailable(): boolean {
    // API key must be a non-empty string and not a placeholder
    return (
      !!this.apiKey &&
      this.apiKey.length > 10 &&
      !this.apiKey.startsWith('your_') &&
      this.apiKey !== 'your_gemini_api_key' &&
      this.apiKey !== 'your_gemini_api_key_here'
    );
  }

  getDefaultModel(): string {
    return this.defaultModel;
  }

  async complete(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    const startTime = Date.now();
    const model = request.model || this.defaultModel;

    const contents = request.messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const systemInstruction = request.systemPrompt
      ? { parts: [{ text: request.systemPrompt }] }
      : undefined;

    try {
      const response = await fetch(this.getBaseUrl(model), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          systemInstruction,
          generationConfig: {
            maxOutputTokens: request.maxTokens || 2048,
            temperature: request.temperature || 0.7,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        this.logger.error(`Gemini API error: ${error}`);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const latencyMs = Date.now() - startTime;

      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      return {
        provider: this.name,
        content,
        model,
        usage: data.usageMetadata
          ? {
              promptTokens: data.usageMetadata.promptTokenCount || 0,
              completionTokens: data.usageMetadata.candidatesTokenCount || 0,
              totalTokens: data.usageMetadata.totalTokenCount || 0,
            }
          : undefined,
        latencyMs,
      };
    } catch (error) {
      this.logger.error(`Gemini completion failed: ${error}`);
      throw error;
    }
  }
}
