import OpenAI from 'openai';
import { LLMOptions, LLMResponse, ChatMessage } from '../types/llm.types.js';

export class OpenAIProvider {
    private client: OpenAI;

    constructor(apiKey: string) {
        this.client = new OpenAI({ apiKey });
    }

    async chat(messages: ChatMessage[], options: LLMOptions = {}): Promise<LLMResponse> {
        const {
            temperature = 0.1,
            maxTokens = 2000,
            model = 'gpt-4-turbo',
            responseFormat = { type: 'json_object' }
        } = options;

        const completion = await this.client.chat.completions.create({
            model,
            messages,
            temperature,
            max_tokens: maxTokens,
            response_format: responseFormat as any
        });

        const usage = completion.usage!;
        const cost = this.calculateCost(model, usage.prompt_tokens, usage.completion_tokens);

        return {
            content: completion.choices[0].message.content || '',
            model: completion.model,
            usage: {
                promptTokens: usage.prompt_tokens,
                completionTokens: usage.completion_tokens,
                totalTokens: usage.total_tokens
            },
            cost
        };
    }

    private calculateCost(model: string, promptTokens: number, completionTokens: number): number {
        // GPT-4-turbo pricing (as of Dec 2024)
        const pricing: Record<string, { input: number; output: number }> = {
            'gpt-4-turbo': { input: 0.01, output: 0.03 },
            'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
            'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 }
        };

        const rates = pricing[model] || pricing['gpt-4-turbo'];
        return (promptTokens / 1000) * rates.input + (completionTokens / 1000) * rates.output;
    }
}
