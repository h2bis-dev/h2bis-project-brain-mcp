# ============================================================
# h2bis-pb-mcp/Dockerfile
# Build context: ./h2bis-pb-mcp
#
# NOTE: The MCP server uses stdio transport, not HTTP.
# In local development, AI clients (Copilot, Claude) spawn it
# as a child process directly — no container needed for that.
# This Dockerfile is included for completeness and future
# migration to HTTP/SSE transport for Kubernetes deployment.
# ============================================================

# ---- Stage 1: Builder ----------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src           ./src
RUN npm run build

# ---- Stage 2: Runner -----------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/index.js"]
