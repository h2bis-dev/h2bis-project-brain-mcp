import dotenv from 'dotenv';
dotenv.config();

export const config = {
    llm: {
        provider: process.env.LLM_PROVIDER || 'openai',
        model: process.env.INTENT_EXTRACTION_MODEL || 'gpt-4-turbo',
        apiKey: process.env.OPENAI_API_KEY || '',
        maxCostPerRequest: parseFloat(process.env.MAX_COST_PER_REQUEST || '0.10')
    },
    cache: {
        enabled: process.env.CACHE_ENABLED === 'true',
        ttl: parseInt(process.env.CACHE_TTL || '86400')
    },
    logging: {
        level: (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info'
    }
};
