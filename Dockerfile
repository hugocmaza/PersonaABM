# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar dependencias primero (aprovecha cache de Docker)
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copiar el resto y compilar en modo produccion
COPY . .
RUN npm run build -- --configuration production

# ── Stage 2: Serve ──────────────────────────────────────────────────────────
FROM nginx:alpine AS production

# Eliminar la config default de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar configuracion personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el build de Angular
COPY --from=builder /app/dist/PersonaABM/browser /usr/share/nginx/html

# Permisos correctos para nginx
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
