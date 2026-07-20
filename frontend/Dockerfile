# =========================================================
# Stage 1: build de la app con Vite
# =========================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copio solo los manifests primero para aprovechar la cache de capas de Docker.
COPY package.json package-lock.json* ./

# `npm ci` es determinista (usa el lockfile). Si no hay lockfile, fallback a `npm install`.
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; \
    else npm install --no-audit --no-fund; fi

# Copio el resto del código fuente.
COPY . .

# ⚠️ IMPORTANTE: Vite resuelve las variables VITE_* en BUILD time.
# Si querés apuntar a otro backend, cambiás acá o usás --build-arg al construir.
ARG VITE_API_BASE_URL=http://localhost:8000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ARG VITE_REQUEST_TIMEOUT_MS=30000
ENV VITE_REQUEST_TIMEOUT_MS=$VITE_REQUEST_TIMEOUT_MS

RUN npm run build

# =========================================================
# Stage 2: servir estáticos con Nginx
# =========================================================
FROM nginx:1.27-alpine AS runner

# Configuración custom de Nginx (SPA fallback + headers de seguridad + cache).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copio los artefactos del build desde el stage anterior.
COPY --from=builder /app/dist /usr/share/nginx/html

# Healthcheck simple para que Dokploy/orquestadores sepan si el contenedor responde.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:4173/ || exit 1

# Puerto alto no estándar (4173 = default de `vite preview`) para evitar conflictos
# con otros proyectos que puedan estar corriendo en la misma máquina.
EXPOSE 4173

CMD ["nginx", "-g", "daemon off;"]
