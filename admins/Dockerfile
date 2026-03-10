# ── Étape 1 : build Vite ─────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

# Variables d'environnement injectées au build (elles sont embarquées dans le JS)
ARG VITE_API_URL
ARG VITE_APP_BASE_NAME=/

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_BASE_NAME=$VITE_APP_BASE_NAME

RUN npm run build

# ── Étape 2 : servir les fichiers statiques via Nginx ────────────────────────
FROM nginx:1.27-alpine AS runner

# Supprimer la config par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Config optimisée pour une SPA React / Vite
COPY --from=builder /app/dist /usr/share/nginx/html

COPY <<'EOF' /etc/nginx/conf.d/admin.conf
server {
    listen 3502;
    root /usr/share/nginx/html;
    index index.html;

    # Compression gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 256;

    # Cache des assets statiques (hash dans les noms de fichiers Vite)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback : toutes les routes inconnues → index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Désactiver les logs d'accès pour le health-check
    location = /health {
        access_log off;
        return 200 "ok";
        add_header Content-Type text/plain;
    }
}
EOF

EXPOSE 3502

CMD ["nginx", "-g", "daemon off;"]
