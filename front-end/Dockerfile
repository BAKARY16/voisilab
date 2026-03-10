# ── Étape 1 : installation des dépendances ──────────────────────────────────
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ── Étape 2 : build Next.js ───────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables publiques embarquées au moment du build (NEXT_PUBLIC_*)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_EMAILJS_SERVICE_ID
ARG NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
ARG NEXT_PUBLIC_EMAILJS_RECIPIENT_EMAIL
ARG NEXT_PUBLIC_EMAILJS_TEMPLATE_TEAM
ARG NEXT_PUBLIC_EMAILJS_TEMPLATE_CLIENT

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_EMAILJS_SERVICE_ID=$NEXT_PUBLIC_EMAILJS_SERVICE_ID
ENV NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=$NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
ENV NEXT_PUBLIC_EMAILJS_RECIPIENT_EMAIL=$NEXT_PUBLIC_EMAILJS_RECIPIENT_EMAIL
ENV NEXT_PUBLIC_EMAILJS_TEMPLATE_TEAM=$NEXT_PUBLIC_EMAILJS_TEMPLATE_TEAM
ENV NEXT_PUBLIC_EMAILJS_TEMPLATE_CLIENT=$NEXT_PUBLIC_EMAILJS_TEMPLATE_CLIENT

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Étape 3 : image de production via output standalone ───────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3501
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3501

CMD ["node", "server.js"]
