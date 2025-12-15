import { Injectable, Logger } from '@nestjs/common';
import { AiProviderName, AVAILABLE_MODELS } from '@repo/shared';
import { AiService, ProviderRequestConfig } from '../ai/ai.service';
import { AiCompletionResponse, AiMessage } from '../ai/ai-provider.interface';

export interface ProviderSettings {
  provider: AiProviderName;
  model?: string;
  systemPrompt?: string;
  enabled: boolean;
}

export interface OrchestrationRequest {
  prompt: string;
  providerSettings: ProviderSettings[];
  globalSystemRole?: string;
  conversationHistory?: AiMessage[];
}

export interface OrchestrationResult {
  query: string;
  responses: AiCompletionResponse[];
  consensus: ConsensusResult;
  timestamp: Date;
}

export interface ConsensusResult {
  summary: string;
  agreementLevel: 'high' | 'medium' | 'low';
  keyPoints: string[];
  differences: string[];
}

@Injectable()
export class OrchestrationService {
  private readonly logger = new Logger(OrchestrationService.name);

  constructor(private readonly aiService: AiService) {}

  async orchestrate(request: OrchestrationRequest): Promise<OrchestrationResult> {
    const { prompt, providerSettings, globalSystemRole, conversationHistory = [] } = request;

    const messages: AiMessage[] = [...conversationHistory, { role: 'user', content: prompt }];

    // Get list of actually available providers (with valid API keys)
    const availableProviders = this.aiService.getAvailableProviders();

    // 활성화된 프로바이더 중 실제로 사용 가능한 것만 필터링
    const enabledProviders = providerSettings.filter((s) => s.enabled);

    if (enabledProviders.length === 0) {
      throw new Error('No providers enabled. Please enable at least one AI provider in settings.');
    }

    // Check which enabled providers are actually available
    const unavailableProviders = enabledProviders
      .filter((s) => !availableProviders.includes(s.provider))
      .map((s) => s.provider);

    if (unavailableProviders.length > 0) {
      this.logger.warn(
        `The following enabled providers are not available (missing API keys): ${unavailableProviders.join(', ')}`,
      );
    }

    // Only use providers that are both enabled AND available
    const providerConfigs: ProviderRequestConfig[] = enabledProviders
      .filter((s) => availableProviders.includes(s.provider))
      .map((s) => ({
        provider: s.provider,
        model: s.model,
        systemPrompt: s.systemPrompt || globalSystemRole,
      }));

    if (providerConfigs.length === 0) {
      const missingKeys = enabledProviders.map((s) => s.provider).join(', ');
      throw new Error(
        `No available providers. The enabled providers (${missingKeys}) are missing API keys. ` +
          `Please configure API keys in the backend .env file.`,
      );
    }

    // Get responses from all selected providers with individual settings
    const responses = await this.aiService.completeWithMultipleProviders(
      providerConfigs,
      messages,
      globalSystemRole,
    );

    if (responses.length === 0) {
      throw new Error('No responses received from any provider');
    }

    // Generate consensus from multiple responses
    const consensus = await this.generateConsensus(prompt, responses);

    return {
      query: prompt,
      responses,
      consensus,
      timestamp: new Date(),
    };
  }

  private async generateConsensus(
    originalQuery: string,
    responses: AiCompletionResponse[],
  ): Promise<ConsensusResult> {
    if (responses.length === 1) {
      return {
        summary: responses[0].content,
        agreementLevel: 'high',
        keyPoints: [responses[0].content.slice(0, 200)],
        differences: [],
      };
    }

    // Use one of the available providers to synthesize the consensus
    const availableProviders = this.aiService.getAvailableProviders();
    if (availableProviders.length === 0) {
      return this.createFallbackConsensus(responses);
    }

    const synthesisPrompt = this.createSynthesisPrompt(originalQuery, responses);

    try {
      const synthesisResponse = await this.aiService.completeWithProvider(availableProviders[0], {
        messages: [{ role: 'user', content: synthesisPrompt }],
        systemPrompt: `You are an expert at analyzing and synthesizing multiple AI responses.
Your task is to find common ground, identify key points of agreement, note any differences, and provide a unified answer.

IMPORTANT: You MUST respond with ONLY a valid JSON object, no markdown, no explanation, just pure JSON:
{
  "summary": "A comprehensive synthesized answer (2-3 paragraphs)",
  "agreementLevel": "high" or "medium" or "low",
  "keyPoints": ["key point 1", "key point 2", "key point 3"],
  "differences": ["difference 1", "difference 2"] or [] if none
}

Rules:
- summary: Must be a detailed synthesis, not just a list
- keyPoints: Must have at least 2-3 key points
- agreementLevel: "high" if responses mostly agree, "medium" if some differences, "low" if significant disagreement
- differences: Include only if there are actual disagreements between responses`,
      });

      return this.parseConsensusResponse(synthesisResponse.content);
    } catch (error) {
      this.logger.warn(`Failed to generate AI consensus: ${error}`);
      return this.createFallbackConsensus(responses);
    }
  }

  private createSynthesisPrompt(query: string, responses: AiCompletionResponse[]): string {
    const responsesText = responses
      .map((r) => `### Response from ${r.provider} (${r.model}):\n${r.content}`)
      .join('\n\n');

    return `Original Question: ${query}

The following responses were received from different AI models:

${responsesText}

Please analyze these responses and provide a consensus synthesis.`;
  }

  private parseConsensusResponse(content: string): ConsensusResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const summary = parsed.summary || '';
        const keyPoints = Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [];
        const differences = Array.isArray(parsed.differences) ? parsed.differences : [];

        // Validate summary is not empty
        if (summary && summary.trim().length > 0) {
          return {
            summary,
            agreementLevel: this.validateAgreementLevel(parsed.agreementLevel),
            keyPoints,
            differences,
          };
        }
      } else {
        this.logger.warn('No JSON found in consensus response');
      }
    } catch (err) {
      this.logger.warn(`Failed to parse JSON from consensus response: ${err}`);
    }

    // If JSON parsing fails or summary is empty, use content directly

    return {
      summary: content,
      agreementLevel: 'medium',
      keyPoints: this.extractKeyPoints(content),
      differences: [],
    };
  }

  private validateAgreementLevel(level: string): 'high' | 'medium' | 'low' {
    if (level === 'high' || level === 'medium' || level === 'low') {
      return level;
    }
    return 'medium';
  }

  private extractKeyPoints(content: string): string[] {
    // Try to extract bullet points or numbered lists from content
    const lines = content.split('\n').filter((line) => line.trim());
    const bulletPoints = lines.filter(
      (line) =>
        line.trim().startsWith('-') || line.trim().startsWith('•') || /^\d+\./.test(line.trim()),
    );

    if (bulletPoints.length > 0) {
      return bulletPoints.slice(0, 5).map((p) => p.replace(/^[-•\d.]+\s*/, '').trim());
    }

    // If no bullet points, take first few sentences
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 20);
    return sentences.slice(0, 3).map((s) => s.trim());
  }

  private createFallbackConsensus(responses: AiCompletionResponse[]): ConsensusResult {
    // Create a meaningful summary from multiple responses
    const shortestResponse = responses.reduce((shortest, current) =>
      current.content.length < shortest.content.length ? current : shortest,
    );

    // Use the shortest response as base summary (usually more concise)
    const summary =
      responses.length > 1
        ? `Based on ${responses.length} AI responses: ${shortestResponse.content.slice(0, 500)}${shortestResponse.content.length > 500 ? '...' : ''}`
        : responses[0]?.content || 'No response available';

    // Extract key points from each response
    const keyPoints = responses
      .map((r) => {
        const firstSentence = r.content.split(/[.!?]/)[0]?.trim();
        return firstSentence ? `${r.provider}: ${firstSentence}` : '';
      })
      .filter(Boolean);

    return {
      summary,
      agreementLevel: 'medium',
      keyPoints: keyPoints.slice(0, 5),
      differences: [],
    };
  }

  getAvailableProviders(): AiProviderName[] {
    return this.aiService.getAvailableProviders();
  }

  getProviderModels(provider: AiProviderName) {
    return AVAILABLE_MODELS[provider] || [];
  }

  getDefaultModel(provider: AiProviderName): string {
    return this.aiService.getDefaultModel(provider);
  }
}
