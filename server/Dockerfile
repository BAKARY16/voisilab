FROM node:20-alpine AS base

# ── Étape 1 : installation des dépendances ──────────────────────────────────
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ── Étape 2 : compilation TypeScript ────────────────────────────────────────
FROM base AS builder
WORKDIR /app
# Besoin de toutes les dépendances (devDeps incluses) pour tsc
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Étape 3 : image de production légère ────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3500

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressuser

# Copier uniquement ce qui est nécessaire au runtime
COPY --from=builder /app/dist ./dist
COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Créer les dossiers de données persistantes avec les bonnes permissions
RUN mkdir -p uploads/confidential/projects logs && \
    chown -R expressuser:nodejs uploads logs

USER expressuser

EXPOSE 3500

CMD ["node", "dist/server.js"]
