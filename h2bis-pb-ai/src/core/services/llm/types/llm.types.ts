export interface LLMOptions {
    temperature?: number;
    maxTokens?: number;
    model?: string;
    responseFormat?: { type: 'json_object' | 'text' };
}

export interface LLMResponse {
    content: string;
    model: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    cost: number;
}

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
