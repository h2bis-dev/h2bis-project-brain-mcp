# ============================================================
# h2bis-pb-api/Dockerfile
# Build context: workspace root (h2bis-pb/)
#
# WHY root context? The API has "h2bis-pb-ai": "file:../h2bis-pb-ai"
# in package.json. Docker cannot access paths outside its build
# context, so we root the context at the monorepo level and copy
# both packages in. docker-compose sets: context: .
# ============================================================

# ---- Stage 1: Builder ----------------------------------------
# Full image with devDependencies to compile TypeScript
FROM node:20-alpine AS builder
WORKDIR /app

# Step 1: Build h2bis-pb-ai first (the API's local file dependency)
# Copy package files first — allows Docker to cache this layer
# and skip re-installing if only source code changed.
COPY h2bis-pb-ai/package*.json ./h2bis-pb-ai/
RUN cd h2bis-pb-ai && npm ci

COPY h2bis-pb-ai/tsconfig.json ./h2bis-pb-ai/
COPY h2bis-pb-ai/src ./h2bis-pb-ai/src
RUN cd h2bis-pb-ai && npm run build

# Step 2: Build h2bis-pb-api
COPY h2bis-pb-api/package*.json ./h2bis-pb-api/
# npm ci resolves file:../h2bis-pb-ai — the directory must exist above ↑
RUN cd h2bis-pb-api && npm ci

COPY h2bis-pb-api/tsconfig.json ./h2bis-pb-api/
COPY h2bis-pb-api/src ./h2bis-pb-api/src
RUN cd h2bis-pb-api && npm run build

# ---- Stage 2: Runner -----------------------------------------
# Lean production image — no devDependencies, no TypeScript source
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# The AI package must exist at ../h2bis-pb-ai relative to the API
# so that npm ci --omit=dev can resolve the file: dependency correctly
COPY --from=builder /app/h2bis-pb-ai/package*.json ./h2bis-pb-ai/
COPY --from=builder /app/h2bis-pb-ai/dist          ./h2bis-pb-ai/dist

# Install h2bis-pb-ai's own production dependencies (dotenv, openai, zod).
# Node resolves modules relative to the calling file's location:
# /app/h2bis-pb-ai/dist/... will look in /app/h2bis-pb-ai/node_modules/
# NOT in /app/h2bis-pb-api/node_modules/ — so it needs its own install.
RUN cd h2bis-pb-ai && npm ci --omit=dev

# Install only production dependencies for the API
COPY --from=builder /app/h2bis-pb-api/package*.json ./h2bis-pb-api/
RUN cd h2bis-pb-api && npm ci --omit=dev

# Copy compiled output
COPY --from=builder /app/h2bis-pb-api/dist ./h2bis-pb-api/dist

WORKDIR /app/h2bis-pb-api

EXPOSE 4000
CMD ["node", "dist/index.js"]
