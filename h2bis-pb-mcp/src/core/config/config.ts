import dotenv from 'dotenv';

dotenv.config();

export const config = {
  serverName: process.env.SERVER_NAME || 'h2bis-pb-mcp',
  serverVersion: process.env.SERVER_VERSION || '1.0.0',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:4000',
  
  // API Key authentication (preferred for agents)
  // Generate via: POST /api/auth/api-keys (admin only)
  apiKey: process.env.API_KEY || '',
  
  // Legacy JWT authentication (fallback if no API key)
  apiToken: process.env.API_TOKEN || '',
  apiEmail: process.env.API_EMAIL || '',
  apiPassword: process.env.API_PASSWORD || '',
};