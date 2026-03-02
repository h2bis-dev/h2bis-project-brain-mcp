# ============================================================
# h2bis-pb-ai/Dockerfile
# Build context: h2bis-pb-ai/ subdirectory
# Standalone build of the AI agent library / pipeline runner
# ============================================================

# ---- Stage 1: Builder ----------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Stage 2: Runner -----------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["node", "dist/index.js"]
