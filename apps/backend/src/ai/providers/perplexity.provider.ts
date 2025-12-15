import { Injectable, Logger } from '@nestjs/common';
import { AiProviderName } from '@repo/shared';
import {
  AiProvider,
  AiCompletionRequest,
  AiCompletionResponse,
  CitationInfo,
} from '../ai-provider.interface';

@Injectable()
export class PerplexityProvider implements AiProvider {
  readonly name: AiProviderName = 'perplexity';
  private readonly logger = new Logger(PerplexityProvider.name);
  private readonly apiKey: string;
  private readonly defaultModel: string;
  private readonly baseUrl = 'https://api.perplexity.ai/chat/completions';

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || '';
    this.defaultModel = process.env.PERPLEXITY_MODEL || 'sonar';
  }

  isAvailable(): boolean {
    // API key must be a non-empty string and not a placeholder
    return (
      !!this.apiKey &&
      this.apiKey.length > 10 &&
      !this.apiKey.startsWith('your_') &&
      this.apiKey !== 'your_perplexity_api_key' &&
      this.apiKey !== 'your_perplexity_api_key_here'
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

      // Extract citations from Perplexity response
      // Perplexity response structure:
      // - citations: string[] (URLs in order - [1] = citations[0], [2] = citations[1], etc.)
      // - search_results: { title, url, date, snippet }[] (detailed info for each citation)
      let citations: CitationInfo[] | undefined;

      if (data.citations && Array.isArray(data.citations) && data.citations.length > 0) {
        // Build a map from URL to search_result for title/snippet lookup
        const searchResultsMap = new Map<string, { title?: string; snippet?: string }>();
        if (data.search_results && Array.isArray(data.search_results)) {
          for (const sr of data.search_results) {
            searchResultsMap.set(sr.url, { title: sr.title, snippet: sr.snippet });
          }
        }

        // Map citations (URL strings) to CitationInfo objects
        // citations[0] corresponds to [1] in the text, citations[1] to [2], etc.
        citations = data.citations.map((url: string, idx: number) => {
          const searchResult = searchResultsMap.get(url);
          return {
            index: idx + 1, // [1], [2], [3]...
            url,
            title: searchResult?.title,
          };
        });

        this.logger.debug(`Perplexity: extracted ${citations.length} citations`);
      }

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
        citations,
      };
    } catch (error) {
      this.logger.error(`Perplexity completion failed: ${error}`);
      throw error;
    }
  }
}
