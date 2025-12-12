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

    const messages: AiMessage[] = [
      ...conversationHistory,
      { role: 'user', content: prompt },
    ];

    // 활성화된 프로바이더만 필터링하고 설정 적용
    const providerConfigs: ProviderRequestConfig[] = providerSettings
      .filter((s) => s.enabled)
      .map((s) => ({
        provider: s.provider,
        model: s.model,
        systemPrompt: s.systemPrompt || globalSystemRole,
      }));

    if (providerConfigs.length === 0) {
      throw new Error('No providers enabled');
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
      const synthesisResponse = await this.aiService.completeWithProvider(
        availableProviders[0],
        {
          messages: [{ role: 'user', content: synthesisPrompt }],
          systemPrompt: `You are an expert at analyzing and synthesizing multiple AI responses. 
Your task is to find common ground, identify key points of agreement, note any differences, 
and provide a unified, comprehensive answer that represents the consensus view.
Respond in JSON format with the following structure:
{
  "summary": "The synthesized answer combining the best insights",
  "agreementLevel": "high|medium|low",
  "keyPoints": ["point1", "point2", ...],
  "differences": ["difference1", "difference2", ...]
}`,
        },
      );

      return this.parseConsensusResponse(synthesisResponse.content, responses);
    } catch (error) {
      this.logger.warn(`Failed to generate AI consensus: ${error}`);
      return this.createFallbackConsensus(responses);
    }
  }

  private createSynthesisPrompt(
    query: string,
    responses: AiCompletionResponse[],
  ): string {
    const responsesText = responses
      .map((r) => `### Response from ${r.provider} (${r.model}):\n${r.content}`)
      .join('\n\n');

    return `Original Question: ${query}

The following responses were received from different AI models:

${responsesText}

Please analyze these responses and provide a consensus synthesis.`;
  }

  private parseConsensusResponse(
    content: string,
    _responses: AiCompletionResponse[],
  ): ConsensusResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || content,
          agreementLevel: parsed.agreementLevel || 'medium',
          keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
          differences: Array.isArray(parsed.differences) ? parsed.differences : [],
        };
      }
    } catch {
      this.logger.debug('Failed to parse JSON from consensus response');
    }

    return {
      summary: content,
      agreementLevel: 'medium',
      keyPoints: [],
      differences: [],
    };
  }

  private createFallbackConsensus(
    responses: AiCompletionResponse[],
  ): ConsensusResult {
    // Simple fallback: combine responses
    const combinedContent = responses
      .map((r) => `[${r.provider}]: ${r.content}`)
      .join('\n\n');

    return {
      summary: combinedContent,
      agreementLevel: 'medium',
      keyPoints: responses.map((r) => r.content.slice(0, 100)),
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
