import { createGroq } from '@ai-sdk/groq';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getAllDocsContent } from './mdx';
import { ReactDocsConfig } from './config';

export interface ModelProvider {
  providerType: 'groq' | 'anthropic' | 'openai';
  model?: string;
  baseURL?: string;
  apiKey?: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system' | 'data';
  content: string;
}

export interface FinishResult {
  text: string;
}

export async function streamDocsChatResponse(
  config: ReactDocsConfig,
  messages: Message[],
  systemPrompt?: string,
  onFinishCallback?: (result: FinishResult) => Promise<void>,
  modelProvider?: ModelProvider
) {
  // Default to groq if no provider specified
  const provider = modelProvider || {
    providerType: 'groq',
    model: 'llama-3.3-70b-versatile'
  };

  // Create the appropriate model based on provider type
  let model;
  switch (provider.providerType) {
    case 'anthropic':
      const anthropicProvider = createAnthropic({
        baseURL: provider.baseURL,
        apiKey: provider.apiKey,
      });
      model = anthropicProvider(provider.model || 'claude-3-5-sonnet-20241022');
      break;
    case 'openai':
      const openaiProvider = createOpenAI({
        baseURL: provider.baseURL,
        apiKey: provider.apiKey,
      });
      model = openaiProvider(provider.model || 'gpt-4o');
      break;
    case 'groq':
    default:
      const groqProvider = createGroq({
        baseURL: provider.baseURL,
        apiKey: provider.apiKey,
      });
      model = groqProvider(provider.model || 'llama-3.3-70b-versatile');
      break;
  }

  const docsSystemPrompt = systemPrompt || `You are a helpful assistant for the provided documentation knowledge base.
Based on user questions you should be able to help them by providing answers based on the knowledge base only.
Keep your responses concise and focused.`;

  const docsContent = getAllDocsContent(config);

  const stream = streamText({
    // Type assertion needed due to AI SDK version compatibility between LanguageModelV1/V2
    model: model as Parameters<typeof streamText>[0]['model'],
    onFinish: async (result) => {
      if (onFinishCallback) {
        await onFinishCallback({ text: result.text });
      }
    },
    messages: [
      {
        role: 'system',
        content: `${docsSystemPrompt}
Documentation Knowledge Base:
${docsContent}`,
      },
      ...messages,
    ],
  });

  return stream.toDataStreamResponse();
}
