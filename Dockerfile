# --- Stage 1: Build Frontend ---
FROM node:22-slim AS frontend-builder
WORKDIR /app/frontend

# Disable telemetry and set environment to production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Copy package files and install dependencies
COPY frontend/package*.json ./
# Use --legacy-peer-deps to avoid potential conflicts with newer Next.js/React versions
RUN npm install --legacy-peer-deps

# Copy source and build
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Final Image ---
FROM python:3.11-slim

# Install Node.js, Nginx and Supervisor
RUN apt-get update && apt-get install -y \
    curl \
    nginx \
    supervisor \
    build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Disable telemetry for runtime too
ENV NEXT_TELEMETRY_DISABLED=1

# Copy Backend and install dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy Backend source
COPY backend/ ./backend/

# Copy Frontend Build from Stage 1
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/
COPY --from=frontend-builder /app/frontend/next.config.js ./frontend/

# Install only production dependencies for Frontend
WORKDIR /app/frontend
RUN npm install --omit=dev --legacy-peer-deps

# Copy Nginx and Supervisor configs
WORKDIR /app
COPY nginx.conf /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

COPY supervisord.conf /etc/supervisord.conf

# Expose port 80
EXPOSE 80

# Start everything
CMD ["supervisord", "-n", "-c", "/etc/supervisord.conf"]
