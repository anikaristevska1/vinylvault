# ===== Stage 1: Build the React app =====
FROM node:20-alpine AS builder

WORKDIR /build

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (including dev deps needed for build)
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ===== Stage 2: Serve with nginx =====
FROM nginx:1.27-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder stage
COPY --from=builder /build/dist /usr/share/nginx/html

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]