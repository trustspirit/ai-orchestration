'use client';

import { useState, useCallback } from 'react';
import type { ChatMessage, ConsensusResult, ProviderResponse } from '@repo/shared';
import { sendChatMessage, ProviderSetting } from '../lib/api';

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  lastConsensus: ConsensusResult | null;
  lastResponses: ProviderResponse[] | null;
}

export function useChat(providerSettings: ProviderSetting[], globalSystemRole?: string) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    lastConsensus: null,
    lastResponses: null,
  });

  const sendMessage = useCallback(async (content: string) => {
    const enabledProviders = providerSettings.filter((s) => s.enabled);
    if (!content.trim() || enabledProviders.length === 0) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const conversationHistory = state.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await sendChatMessage({
        prompt: content,
        providerSettings: enabledProviders,
        globalSystemRole,
        conversationHistory,
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.consensus.summary,
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
        lastConsensus: response.consensus,
        lastResponses: response.responses,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'An error occurred',
      }));
    }
  }, [providerSettings, globalSystemRole, state.messages]);

  const clearChat = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
      lastConsensus: null,
      lastResponses: null,
    });
  }, []);

  return {
    ...state,
    sendMessage,
    clearChat,
  };
}
