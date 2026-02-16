import { OpenAIProvider } from './providers/openai.provider.js';
import { LLMOptions, LLMResponse, ChatMessage } from './types/llm.types.js';
import { config } from '../../config/config.js';
import { logger } from '../../utils/logger.js';

export class LLMService {
    private provider: OpenAIProvider;

    constructor() {
        this.provider = new OpenAIProvider(config.llm.apiKey);
    }

    async chat(messages: ChatMessage[], options: LLMOptions = {}): Promise<LLMResponse> {
        const startTime = Date.now();

        try {
            const response = await this.provider.chat(messages, {
                ...options,
                model: options.model || config.llm.model
            });

            const latency = Date.now() - startTime;

            logger.info('LLM request completed', {
                model: response.model,
                tokens: response.usage.totalTokens,
                cost: response.cost.toFixed(4),
                latency: `${latency}ms`
            });

            // Check cost limit
            if (response.cost > config.llm.maxCostPerRequest) {
                logger.warn('Request exceeded cost limit', {
                    cost: response.cost,
                    limit: config.llm.maxCostPerRequest
                });
            }

            return response;
        } catch (error) {
            logger.error('LLM request failed', { error });
            throw error;
        }
    }

    async chatJSON<T>(messages: ChatMessage[], options: LLMOptions = {}): Promise<T> {
        const response = await this.chat(messages, {
            ...options,
            responseFormat: { type: 'json_object' }
        });

        try {
            return JSON.parse(response.content);
        } catch (error) {
            logger.error('Failed to parse JSON response', { content: response.content });
            throw new Error('Invalid JSON response from LLM');
        }
    }
}
